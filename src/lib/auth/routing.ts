import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getIsSuperAdmin } from "@/lib/auth/permissions";
import { requireUser } from "@/lib/auth/user";
import type { AuthenticatedAccess } from "@/lib/auth/routing-rules";

export {
  resolveDashboardDestination,
  resolvePostLoginDestination,
} from "@/lib/auth/routing-rules";

export async function getAuthenticatedAccess(): Promise<AuthenticatedAccess> {
  const user = await requireUser();
  const isSuperAdmin = await getIsSuperAdmin();
  if (isSuperAdmin) return { isSuperAdmin: true, organisationCount: 0 };

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("organisation_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    throw new Error("Unable to resolve organisation access.", { cause: error });
  }

  return { isSuperAdmin: false, organisationCount: count ?? 0 };
}
