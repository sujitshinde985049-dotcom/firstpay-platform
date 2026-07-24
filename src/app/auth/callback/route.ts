import { NextResponse } from "next/server";
import { safeInternalRedirect } from "@/lib/auth/safe-redirect";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalRedirect(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL("/auth/redirect", requestUrl.origin);
      redirectUrl.searchParams.set("next", next);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback", requestUrl.origin),
  );
}
