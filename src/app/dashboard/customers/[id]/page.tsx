import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/dashboard/customer-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await requireOrganisation();
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id,company,contact_name,email,phone,status,tags,notes")
    .eq("id", id)
    .eq("organisation_id", org.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) notFound();
  return (
    <div>
      <PageHeader
        title={data.company}
        description="Edit customer identity, contact details, tags, status, and notes."
      />
      <CustomerForm customer={data} />
    </div>
  );
}
