"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/auth/permissions";
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
