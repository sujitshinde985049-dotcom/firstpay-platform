"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";

export async function selectOrganisationAction(formData: FormData) {
  const user = await requireUser();
  const organisationId = z
    .string()
    .uuid()
    .parse(formData.get("organisation_id"));
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organisation_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("organisation_id", organisationId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) throw new Error("This organisation is not available.");

  const cookieStore = await cookies();
  cookieStore.set("firstpay_organisation_id", organisationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  redirect("/dashboard");
}
