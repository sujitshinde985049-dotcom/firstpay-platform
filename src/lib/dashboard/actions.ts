"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getOrganisationFeatures } from "@/lib/features/server";
import { initiatePhonePeMandate } from "@/lib/mandates/phonepe-initiation";
import { mandateRoutes } from "@/lib/mandates/routes";
const customerSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().min(2).max(160),
  contact_name: z.string().min(2).max(160),
  email: z.email(),
  phone: z.string().max(30).optional(),
  status: z.enum(["active", "inactive", "blocked"]),
  tags: z.string().optional(),
  notes: z.string().max(5000).optional(),
});
const mandateSchema = z.object({
  customer_id: z.string().uuid(),
  reference: z.string().trim().min(2).max(160),
  type: z.enum(["upi_autopay", "e_nach"]),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  amount: z.coerce.number().positive().max(999999999999.99),
  starts_at: z.string().date().optional(),
  ends_at: z.string().date().optional(),
});
async function requireManage() {
  const org = await requireOrganisation();
  if (!(await hasPermission(org.id, "customers.manage")))
    throw new Error("You do not have permission to manage customers.");
  return org;
}
export async function saveCustomerAction(formData: FormData) {
  const org = await requireManage();
  const values = customerSchema.parse({
    id: String(formData.get("id") || "") || undefined,
    company: formData.get("company"),
    contact_name: formData.get("contact_name"),
    email: formData.get("email"),
    phone: String(formData.get("phone") || "") || undefined,
    status: formData.get("status"),
    tags: String(formData.get("tags") || ""),
    notes: String(formData.get("notes") || ""),
  });
  const supabase = await createClient();
  const payload = {
    organisation_id: org.id,
    company: values.company,
    contact_name: values.contact_name,
    email: values.email,
    phone: values.phone ?? null,
    status: values.status,
    tags: (values.tags ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    notes: values.notes ?? null,
  };
  if (values.id) {
    const { error } = await supabase
      .from("customers")
      .update(payload)
      .eq("id", values.id)
      .eq("organisation_id", org.id);
    if (error) throw new Error("Unable to update customer.", { cause: error });
  } else {
    const { error } = await supabase.from("customers").insert(payload);
    if (error) throw new Error("Unable to create customer.", { cause: error });
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
export async function deleteCustomerAction(formData: FormData) {
  const org = await requireManage();
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ deleted_at: new Date().toISOString(), status: "inactive" })
    .eq("id", id)
    .eq("organisation_id", org.id);
  if (error) throw new Error("Unable to delete customer.", { cause: error });
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function createMandateAction(formData: FormData) {
  const org = await requireOrganisation();
  if (!(await hasPermission(org.id, "mandates.create"))) {
    throw new Error("You do not have permission to create mandates.");
  }

  const values = mandateSchema.parse({
    customer_id: formData.get("customer_id"),
    reference: formData.get("reference"),
    type: formData.get("type"),
    frequency: formData.get("frequency"),
    amount: formData.get("amount"),
    starts_at: String(formData.get("starts_at") || "") || undefined,
    ends_at: String(formData.get("ends_at") || "") || undefined,
  });
  if (values.starts_at && values.ends_at && values.ends_at < values.starts_at) {
    throw new Error("The mandate end date must be after its start date.");
  }

  const features = await getOrganisationFeatures(org.id, [
    "upi_autopay",
    "e_nach",
  ]);
  if (
    (values.type === "upi_autopay" && !features.upi_autopay) ||
    (values.type === "e_nach" && !features.e_nach)
  ) {
    throw new Error("The selected mandate rail is not enabled.");
  }

  const supabase = await createClient();
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("id", values.customer_id)
    .eq("organisation_id", org.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();
  if (customerError) {
    throw new Error("Unable to validate the selected customer.", {
      cause: customerError,
    });
  }
  if (!customer) throw new Error("The selected customer was not found.");

  const startsAt = values.starts_at
    ? new Date(`${values.starts_at}T00:00:00.000Z`).toISOString()
    : null;
  const endsAt = values.ends_at
    ? new Date(`${values.ends_at}T23:59:59.999Z`).toISOString()
    : null;
  const { data: mandate, error } = await supabase
    .from("mandates")
    .insert({
      organisation_id: org.id,
      customer_id: values.customer_id,
      reference: values.reference,
      type: values.type,
      frequency: values.frequency,
      amount: values.amount,
      starts_at: startsAt,
      ends_at: endsAt,
    })
    .select("id,metadata")
    .single();
  if (error) throw new Error("Unable to create mandate.", { cause: error });

  if (values.type === "upi_autopay") {
    await initiatePhonePeMandate({
      id: mandate.id,
      organisationId: org.id,
      customerId: values.customer_id,
      reference: values.reference,
      amount: values.amount,
      frequency: values.frequency,
      startsAt,
      endsAt,
      metadata:
        mandate.metadata &&
        typeof mandate.metadata === "object" &&
        !Array.isArray(mandate.metadata)
          ? mandate.metadata
          : {},
    });
  }

  revalidatePath("/dashboard/mandates");
  redirect(mandateRoutes.details(mandate.id));
}
