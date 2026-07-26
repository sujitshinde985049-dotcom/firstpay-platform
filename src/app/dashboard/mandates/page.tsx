import { ModulePage } from "@/components/dashboard/module-page";
import { hasPermission } from "@/lib/auth/permissions";
import { getRows } from "@/lib/dashboard/data";
import { canCreateMandate } from "@/lib/features/rules";
import { getOrganisationFeatures } from "@/lib/features/server";
import { requireOrganisation } from "@/lib/organisations/current";

export default async function Page() {
  const organisation = await requireOrganisation();
  const [rows, hasCreatePermission, features] = await Promise.all([
    getRows("mandates"),
    hasPermission(organisation.id, "mandates.create"),
    getOrganisationFeatures(organisation.id, ["upi_autopay", "e_nach"]),
  ]);
  const showCreateMandate = canCreateMandate({
    hasCreatePermission,
    upiAutoPayEnabled: features.upi_autopay,
    eNachEnabled: features.e_nach,
  });

  return (
    <ModulePage
      title="Mandates"
      description="Monitor UPI AutoPay and e-NACH mandates, frequency, amount, and history."
      rows={rows}
      valueLabel="Amount"
      createLabel={showCreateMandate ? "Create mandate" : undefined}
    />
  );
}
