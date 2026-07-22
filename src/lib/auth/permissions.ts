import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/user";

export const permissions = [
  "organisation.read",
  "organisation.update",
  "members.read",
  "members.manage",
  "roles.read",
  "roles.manage",
  "billing.read",
  "billing.manage",
  "sales.read",
  "sales.manage",
  "support.read",
  "support.manage",
  "developer.read",
  "developer.manage",
] as const;

export type Permission = (typeof permissions)[number];

export const organisationRoles = [
  "Admin",
  "Manager",
  "Sales",
  "Support",
  "Finance",
  "Developer",
  "Viewer",
] as const;

export type OrganisationRole = (typeof organisationRoles)[number];

export const hasPermission = cache(
  async (organisationId: string, permission: Permission) => {
    await requireUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("has_permission", {
      requested_organisation_id: organisationId,
      requested_permission: permission,
    });

    if (error) {
      throw new Error("Unable to verify permission.", { cause: error });
    }

    return data === true;
  },
);

export const requireSuperAdmin = cache(async () => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .single();

  if (error || !data?.is_super_admin) {
    redirect("/dashboard");
  }

  return user;
});
