import { requireOrganisation } from "@/lib/organisations/current";

export default async function DashboardPage() {
  const organisation = await requireOrganisation();
  return (
    <section>
      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
        {organisation.name}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
        Organisation dashboard
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Tenant-scoped modules can be added here.
      </p>
    </section>
  );
}
