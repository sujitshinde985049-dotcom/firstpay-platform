import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/admin/submit-button";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { selectOrganisationAction } from "./actions";

export default async function SelectOrganisationPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organisation_members")
    .select("organisation_id,organisation:organisations(id,name,slug)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at");

  if (error) throw new Error("Unable to load organisations.", { cause: error });
  if (!data?.length) redirect("/dashboard/no-organisation");

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold">Choose an organisation</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Select the workspace you want to manage in this session.
      </p>
      <div className="mt-8 grid gap-3">
        {data.map((membership) => {
          const organisation = Array.isArray(membership.organisation)
            ? membership.organisation[0]
            : membership.organisation;
          if (!organisation) return null;
          return (
            <form
              key={membership.organisation_id}
              action={selectOrganisationAction}
              className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 dark:bg-slate-950"
            >
              <input
                type="hidden"
                name="organisation_id"
                value={membership.organisation_id}
              />
              <span>
                <strong className="block">{organisation.name}</strong>
                <span className="text-sm text-slate-500">
                  {organisation.slug}
                </span>
              </span>
              <SubmitButton pending="Opening…">Open workspace</SubmitButton>
            </form>
          );
        })}
      </div>
    </section>
  );
}
