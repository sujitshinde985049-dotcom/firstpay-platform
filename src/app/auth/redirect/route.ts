import { NextResponse } from "next/server";
import { safeInternalRedirect } from "@/lib/auth/safe-redirect";
import {
  getAuthenticatedAccess,
  resolvePostLoginDestination,
} from "@/lib/auth/routing";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const access = await getAuthenticatedAccess();
  const destination = resolvePostLoginDestination(access);

  if (destination === "/dashboard") {
    const requestedNext = safeInternalRedirect(
      requestUrl.searchParams.get("next"),
    );
    if (
      requestedNext === "/dashboard" ||
      requestedNext.startsWith("/dashboard/")
    ) {
      return NextResponse.redirect(new URL(requestedNext, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
