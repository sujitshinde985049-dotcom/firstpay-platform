import { NextResponse } from "next/server";
import { z } from "zod";
import { mandateRoutes } from "@/lib/mandates/routes";

const mandateIdSchema = z.uuid();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mandateId: string }> },
) {
  const { mandateId } = await params;
  const parsed = mandateIdSchema.safeParse(mandateId);
  const destination = parsed.success
    ? mandateRoutes.details(parsed.data)
    : mandateRoutes.list;

  return NextResponse.redirect(new URL(destination, request.url));
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ mandateId: string }> },
) {
  const { mandateId } = await params;
  if (!mandateIdSchema.safeParse(mandateId).success) {
    return NextResponse.json({ accepted: false }, { status: 400 });
  }

  // Provider callbacks are acknowledged but cannot mutate mandate state until
  // PhonePe supplies and we configure an official verification contract.
  return NextResponse.json({ accepted: true }, { status: 202 });
}
