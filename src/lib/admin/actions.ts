"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { recordAuditEvent } from "@/lib/admin/audit";

const clientSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["active", "suspended", "archived"]),
  subscriptionPlanId: z.uuid().optional().or(z.literal("")),
  trialEndsAt: z.string().optional(),
  adminEmail: z.email().optional().or(z.literal("")),
});

export async function createClientAction(formData: FormData) {
  await requireSuperAdmin();
  const values = clientSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    subscriptionPlanId: formData.get("subscription_plan_id"),
    trialEndsAt: formData.get("trial_ends_at"),
    adminEmail: formData.get("admin_email"),
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organisations")
    .insert({
      name: values.name,
      slug: values.slug,
      status: values.status,
      subscription_plan_id: values.subscriptionPlanId || null,
      trial_ends_at: values.trialEndsAt || null,
    })
    .select("id")
    .single();
  if (error) throw new Error("Unable to create client.", { cause: error });
  await recordAuditEvent({
    action: "client.created",
    entityType: "organisation",
    entityId: data.id,
    organisationId: data.id,
  });
  if (values.adminEmail) await inviteClientAdmin(data.id, values.adminEmail);
  redirect(`/super-admin/clients/${data.id}`);
}

export async function updateClientAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const values = clientSchema.omit({ adminEmail: true }).parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    subscriptionPlanId: formData.get("subscription_plan_id"),
    trialEndsAt: formData.get("trial_ends_at"),
  });
  const branding = {
    primary_color: String(formData.get("primary_color") ?? ""),
    logo_url: String(formData.get("logo_url") ?? ""),
  };
  const supabase = await createClient();
  const { error } = await supabase
    .from("organisations")
    .update({
      name: values.name,
      slug: values.slug,
      status: values.status,
      subscription_plan_id: values.subscriptionPlanId || null,
      trial_ends_at: values.trialEndsAt || null,
      branding,
    })
    .eq("id", id);
  if (error) throw new Error("Unable to update client.", { cause: error });
  await recordAuditEvent({
    action: "client.updated",
    entityType: "organisation",
    entityId: id,
    organisationId: id,
  });
  revalidatePath(`/super-admin/clients/${id}`);
}

export async function setClientStatusAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["active", "suspended"]).parse(formData.get("status"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("organisations")
    .update({ status })
    .eq("id", id)
    .is("deleted_at", null);
  if (error)
    throw new Error("Unable to change client status.", { cause: error });
  await recordAuditEvent({
    action: `client.${status}`,
    entityType: "organisation",
    entityId: id,
    organisationId: id,
    severity: status === "suspended" ? "warning" : "info",
  });
  revalidatePath("/super-admin/clients");
  revalidatePath(`/super-admin/clients/${id}`);
}

export async function deleteClientAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("organisations")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);
  if (error) throw new Error("Unable to delete client.", { cause: error });
  await recordAuditEvent({
    action: "client.deleted",
    entityType: "organisation",
    entityId: id,
    organisationId: id,
    severity: "critical",
  });
  redirect("/super-admin/clients");
}

export async function inviteClientAdminAction(formData: FormData) {
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const email = z.email().parse(formData.get("email"));
  await inviteClientAdmin(organisationId, email);
  revalidatePath(`/super-admin/clients/${organisationId}`);
}

export async function createClientAdminAction(formData: FormData) {
  await requireSuperAdmin();
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const email = z.email().parse(formData.get("email"));
  const password = z.string().min(12).parse(formData.get("temporary_password"));
  const fullName = z.string().min(2).parse(formData.get("full_name"));
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      organisation_id: organisationId,
      created_by_super_admin: true,
    },
  });
  if (error)
    throw new Error("Unable to create Client Admin.", { cause: error });
  await addAdminMembership(organisationId, data.user.id, "active");
  await recordAuditEvent({
    action: "client_admin.created",
    entityType: "profile",
    entityId: data.user.id,
    organisationId,
    metadata: { email },
  });
  revalidatePath(`/super-admin/clients/${organisationId}`);
}

async function inviteClientAdmin(organisationId: string, email: string) {
  const inviter = await requireSuperAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { organisation_id: organisationId, invited_role: "Admin" },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/dashboard`,
  });
  if (error)
    throw new Error("Unable to invite client admin.", { cause: error });
  const supabase = await createClient();
  await supabase.from("organisation_invitations").insert({
    organisation_id: organisationId,
    email,
    role_name: "Admin",
    invited_by: inviter.id,
  });
  if (data.user) {
    await addAdminMembership(organisationId, data.user.id, "invited");
  }
  await recordAuditEvent({
    action: "client_admin.invited",
    entityType: "profile",
    entityId: data.user?.id,
    organisationId,
    metadata: { email },
  });
}

async function addAdminMembership(
  organisationId: string,
  userId: string,
  status: "active" | "invited",
) {
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("organisation_members")
    .upsert(
      {
        organisation_id: organisationId,
        user_id: userId,
        status,
        invited_at: status === "invited" ? new Date().toISOString() : null,
        joined_at: status === "active" ? new Date().toISOString() : null,
      },
      { onConflict: "organisation_id,user_id" },
    )
    .select("id")
    .single();
  const { data: role } = await supabase
    .from("organisation_roles")
    .select("id")
    .eq("organisation_id", organisationId)
    .eq("name", "Admin")
    .single();
  if (member && role)
    await supabase.from("organisation_member_roles").upsert(
      {
        organisation_id: organisationId,
        member_id: member.id,
        role_id: role.id,
      },
      { onConflict: "organisation_id,member_id,role_id" },
    );
}

export async function resendInvitationAction(formData: FormData) {
  await requireSuperAdmin();
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const email = z.email().parse(formData.get("email"));
  await inviteClientAdmin(organisationId, email);
}
export async function resetPasswordAction(formData: FormData) {
  await requireSuperAdmin();
  const email = z.email().parse(formData.get("email"));
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/update-password`,
  });
  if (error)
    throw new Error("Unable to create password reset.", { cause: error });
  await recordAuditEvent({
    action: "user.password_reset_requested",
    entityType: "profile",
    metadata: { email },
  });
}
export async function setUserActiveAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const active = formData.get("active") === "true";
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ deactivated_at: active ? null : new Date().toISOString() })
    .eq("id", id);
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(id, {
    ban_duration: active ? "none" : "876000h",
  });
  await recordAuditEvent({
    action: active ? "user.activated" : "user.deactivated",
    entityType: "profile",
    entityId: id,
    severity: active ? "info" : "warning",
  });
  revalidatePath("/super-admin/users");
}
export async function deleteUserAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({
      deleted_at: new Date().toISOString(),
      deactivated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("is_super_admin", false);
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(id, { ban_duration: "876000h" });
  await recordAuditEvent({
    action: "user.deleted",
    entityType: "profile",
    entityId: id,
    severity: "critical",
  });
  revalidatePath("/super-admin/users");
}
export async function assignUserRoleAction(formData: FormData) {
  await requireSuperAdmin();
  const memberId = z.string().uuid().parse(formData.get("member_id"));
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const roleId = z.string().uuid().parse(formData.get("role_id"));
  const supabase = await createClient();
  await supabase
    .from("organisation_member_roles")
    .delete()
    .eq("member_id", memberId)
    .eq("organisation_id", organisationId);
  await supabase.from("organisation_member_roles").insert({
    member_id: memberId,
    organisation_id: organisationId,
    role_id: roleId,
  });
  await recordAuditEvent({
    action: "user.role_assigned",
    entityType: "organisation_member",
    entityId: memberId,
    organisationId,
    metadata: { role_id: roleId },
  });
  revalidatePath("/super-admin/users");
}
export async function setRolePermissionAction(formData: FormData) {
  await requireSuperAdmin();
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const roleId = z.string().uuid().parse(formData.get("role_id"));
  const permissionId = z.string().uuid().parse(formData.get("permission_id"));
  const enabled = formData.get("enabled") === "true";
  const supabase = await createClient();
  if (enabled) {
    await supabase.from("organisation_role_permissions").upsert(
      {
        organisation_id: organisationId,
        role_id: roleId,
        permission_id: permissionId,
      },
      { onConflict: "organisation_id,role_id,permission_id" },
    );
  } else {
    await supabase
      .from("organisation_role_permissions")
      .delete()
      .eq("organisation_id", organisationId)
      .eq("role_id", roleId)
      .eq("permission_id", permissionId);
  }
  await recordAuditEvent({
    action: enabled ? "permission.assigned" : "permission.removed",
    entityType: "organisation_role",
    entityId: roleId,
    organisationId,
    metadata: { permission_id: permissionId },
  });
  revalidatePath("/super-admin/permissions");
}
export async function removeClientAdminAction(formData: FormData) {
  await requireSuperAdmin();
  const memberId = z.string().uuid().parse(formData.get("member_id"));
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const supabase = await createClient();
  await supabase
    .from("organisation_members")
    .delete()
    .eq("id", memberId)
    .eq("organisation_id", organisationId);
  await recordAuditEvent({
    action: "client_admin.removed",
    entityType: "organisation_member",
    entityId: memberId,
    organisationId,
    severity: "warning",
  });
  revalidatePath(`/super-admin/clients/${organisationId}`);
}

export async function savePlanAction(formData: FormData) {
  await requireSuperAdmin();
  const id = String(formData.get("id") ?? "");
  const name = z.string().min(2).parse(formData.get("name"));
  const slug = z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .parse(formData.get("slug"));
  const limits = {
    users: Number(formData.get("users")),
    storage_gb: Number(formData.get("storage_gb")),
    api_requests: Number(formData.get("api_requests")),
    webhooks: Number(formData.get("webhooks")),
    reports: Number(formData.get("reports")),
    priority_support: formData.get("priority_support") === "on",
  };
  const payload = {
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    price_monthly: Number(formData.get("price_monthly") ?? 0),
    price_yearly: Number(formData.get("price_yearly") ?? 0),
    currency: "INR",
    limits,
    is_active: formData.get("is_active") === "on",
  };
  const supabase = await createClient();
  if (id)
    await supabase
      .from("subscription_plans")
      .update(payload)
      .eq("id", z.string().uuid().parse(id));
  else await supabase.from("subscription_plans").insert(payload);
  await recordAuditEvent({
    action: id ? "plan.updated" : "plan.created",
    entityType: "subscription_plan",
    entityId: id || undefined,
  });
  revalidatePath("/super-admin/plans");
}

export async function saveFeatureFlagAction(formData: FormData) {
  await requireSuperAdmin();
  const organisationId = String(formData.get("organisation_id") ?? "") || null;
  const key = z.string().min(2).parse(formData.get("key"));
  const enabled = formData.get("enabled") === "true";
  const supabase = await createClient();
  let query = supabase.from("feature_flags").select("id").eq("key", key);
  query = organisationId
    ? query.eq("organisation_id", organisationId)
    : query.is("organisation_id", null);
  const existing = await query.maybeSingle();
  if (existing.data)
    await supabase
      .from("feature_flags")
      .update({ enabled })
      .eq("id", existing.data.id);
  else
    await supabase
      .from("feature_flags")
      .insert({ organisation_id: organisationId, key, enabled });
  await recordAuditEvent({
    action: "feature_flag.updated",
    entityType: "feature_flag",
    organisationId: organisationId ?? undefined,
    metadata: { key, enabled },
  });
  revalidatePath("/super-admin/feature-flags");
}

export async function saveSettingsAction(formData: FormData) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const settings = [
    {
      key: "company",
      value: {
        name: formData.get("company_name"),
        support_email: formData.get("support_email"),
        sales_email: formData.get("sales_email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      },
      is_public: true,
    },
    {
      key: "integrations",
      value: {
        smtp_host: formData.get("smtp_host"),
        smtp_port: formData.get("smtp_port"),
        google_analytics_id: formData.get("google_analytics_id"),
        tag_manager_id: formData.get("tag_manager_id"),
      },
      is_public: false,
    },
    {
      key: "appearance",
      value: {
        theme: formData.get("theme"),
        logo_path: formData.get("logo_path"),
        favicon_path: formData.get("favicon_path"),
      },
      is_public: true,
    },
    {
      key: "maintenance",
      value: {
        enabled: formData.get("maintenance_mode") === "on",
        message: formData.get("maintenance_message"),
      },
      is_public: true,
    },
  ];
  await supabase
    .from("platform_settings")
    .upsert(settings, { onConflict: "key" });
  await recordAuditEvent({
    action: "settings.updated",
    entityType: "platform_settings",
  });
  revalidatePath("/super-admin/settings");
}

export async function saveAnnouncementAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload = {
    title: z.string().min(2).parse(formData.get("title")),
    body: z.string().min(2).parse(formData.get("body")),
    priority: z
      .enum(["low", "normal", "high", "critical"])
      .parse(formData.get("priority")),
    audience: z
      .enum(["all", "platform", "organisation"])
      .parse(formData.get("audience")),
    organisation_id: String(formData.get("organisation_id") ?? "") || null,
    status: z
      .enum(["draft", "scheduled", "published", "expired"])
      .parse(formData.get("status")),
    publish_at: String(formData.get("publish_at") ?? "") || null,
    expire_at: String(formData.get("expire_at") ?? "") || null,
    created_by: user.id,
  };
  if (id)
    await supabase
      .from("announcements")
      .update(payload)
      .eq("id", z.string().uuid().parse(id));
  else await supabase.from("announcements").insert(payload);
  await recordAuditEvent({
    action: id ? "announcement.updated" : "announcement.created",
    entityType: "announcement",
    entityId: id || undefined,
  });
  revalidatePath("/super-admin/announcements");
}

export async function saveCmsEntryAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload = {
    entry_type: z
      .enum([
        "homepage",
        "hero",
        "solution",
        "about",
        "contact",
        "developer",
        "industry",
        "statistic",
        "footer",
        "navigation",
        "faq",
        "testimonial",
        "partner",
        "client_logo",
        "blog",
        "legal",
        "seo",
        "dynamic_page",
      ])
      .parse(formData.get("entry_type")),
    slug: z.string().min(1).parse(formData.get("slug")),
    title: z.string().min(2).parse(formData.get("title")),
    content: {
      body: String(formData.get("body") ?? ""),
      metadata: String(formData.get("metadata") ?? ""),
    },
    status: z
      .enum(["draft", "scheduled", "published", "archived"])
      .parse(formData.get("status")),
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_by: user.id,
    created_by: user.id,
    published_at:
      formData.get("status") === "published" ? new Date().toISOString() : null,
    scheduled_at: String(formData.get("scheduled_at") ?? "") || null,
    seo: {
      title: String(formData.get("seo_title") ?? ""),
      description: String(formData.get("seo_description") ?? ""),
      canonical: String(formData.get("canonical") ?? ""),
      robots: String(formData.get("robots") ?? "index,follow"),
    },
  };
  if (id)
    await supabase
      .from("cms_entries")
      .update(payload)
      .eq("id", z.string().uuid().parse(id));
  else await supabase.from("cms_entries").insert(payload);
  await recordAuditEvent({
    action: id ? "cms.updated" : "cms.created",
    entityType: "cms_entry",
    entityId: id || undefined,
  });
  revalidatePath("/super-admin/cms");
}

export async function createMediaFolderAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const name = z.string().min(1).max(80).parse(formData.get("name"));
  const parentPath = String(formData.get("parent_path") ?? "").replace(
    /^\/+|\/+$/g,
    "",
  );
  const path = `${parentPath ? `${parentPath}/` : ""}${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const supabase = await createClient();
  await supabase
    .from("media_folders")
    .insert({ name, path, created_by: user.id });
  revalidatePath("/super-admin/media");
}
export async function uploadMediaAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("A file is required.");
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
  ];
  if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024)
    throw new Error("File must be an approved type and no larger than 10 MB.");
  const folder = String(formData.get("folder") ?? "uploads").replace(
    /[^a-zA-Z0-9/_-]/g,
    "",
  );
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("platform-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Upload failed.", { cause: error });
  const supabase = await createClient();
  await supabase.from("media_assets").insert({
    storage_path: path,
    name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    alt_text: String(formData.get("alt_text") ?? ""),
    uploaded_by: user.id,
  });
  await recordAuditEvent({
    action: "media.uploaded",
    entityType: "media_asset",
    metadata: { path, size: file.size },
  });
  revalidatePath("/super-admin/media");
}
export async function renameMediaAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const name = z.string().min(1).max(160).parse(formData.get("name"));
  const supabase = await createClient();
  await supabase.from("media_assets").update({ name }).eq("id", id);
  await recordAuditEvent({
    action: "media.renamed",
    entityType: "media_asset",
    entityId: id,
  });
  revalidatePath("/super-admin/media");
}
export async function deleteMediaAction(formData: FormData) {
  await requireSuperAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const path = z.string().min(1).parse(formData.get("path"));
  const admin = createAdminClient();
  await admin.storage.from("platform-media").remove([path]);
  const supabase = await createClient();
  await supabase
    .from("media_assets")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  await recordAuditEvent({
    action: "media.deleted",
    entityType: "media_asset",
    entityId: id,
    severity: "warning",
  });
  revalidatePath("/super-admin/media");
}
