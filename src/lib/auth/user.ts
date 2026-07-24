import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("deactivated_at,deleted_at")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.deactivated_at || profile?.deleted_at) {
    await supabase.auth.signOut();
    redirect("/login?reason=account_unavailable");
  }

  return user;
}
