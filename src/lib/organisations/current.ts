import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";

export type CurrentOrganisation = {
  id: string;
  name: string;
  slug: string;
};

export const getCurrentOrganisation = cache(
  async (): Promise<CurrentOrganisation | null> => {
    const user = await requireUser();
    const cookieStore = await cookies();
    const selectedOrganisationId = cookieStore.get(
      "firstpay_organisation_id",
    )?.value;
    const supabase = await createClient();

    let query = supabase
      .from("organisation_members")
      .select("organisation:organisations(id, name, slug)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1);

    if (selectedOrganisationId) {
      query = query.eq("organisation_id", selectedOrganisationId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error("Unable to load the current organisation.", {
        cause: error,
      });
    }

    const organisation = data?.organisation;
    return organisation && !Array.isArray(organisation) ? organisation : null;
  },
);

export async function requireOrganisation() {
  const organisation = await getCurrentOrganisation();

  if (!organisation) {
    redirect("/dashboard/no-organisation");
  }

  return organisation;
}
