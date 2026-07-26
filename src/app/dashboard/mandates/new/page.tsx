import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { MandateForm } from "@/components/dashboard/mandate-form";
import { hasPermission } from "@/lib/auth/permissions";
import { getOrganisationFeatures } from "@/lib/features/server";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const organisation = await requireOrganisation();
  const [canCreate, features] = await Promise.all([
    hasPermission(organisation.id, "mandates.create"),
    getOrganisationFeatures(organisation.id, ["upi_autopay", "e_nach"]),
  ]);

  if (!canCreate || (!features.upi_autopay && !features.e_nach)) {
    redirect("/dashboard/mandates");
  }

  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from("customers")
    .select("id,company,contact_name")
    .eq("organisation_id", organisation.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("company");
  if (error) {
    throw new Error("Unable to load customers for mandate creation.", {
      cause: error,
    });
  }

  const enabledTypes: Array<"upi_autopay" | "e_nach"> = [];
  if (features.upi_autopay) enabledTypes.push("upi_autopay");
  if (features.e_nach) enabledTypes.push("e_nach");

  return (
    <div>
      <PageHeader
        title="Create mandate"
        description="Create a tenant-scoped UPI AutoPay or e-NACH mandate."
      />
      <MandateForm customers={customers ?? []} enabledTypes={enabledTypes} />
    </div>
  );
}
