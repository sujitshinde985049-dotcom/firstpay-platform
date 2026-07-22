import { CustomerForm } from "@/components/dashboard/customer-form";
import { PageHeader } from "@/components/admin/page-header";
export default function Page() {
  return (
    <div>
      <PageHeader
        title="Add customer"
        description="Create an organisation-scoped customer profile."
      />
      <CustomerForm />
    </div>
  );
}
