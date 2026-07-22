"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({ email: z.email("Enter a valid email address.") });
type ForgotPasswordValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    setSent(true);
  });

  if (sent) {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        If an account exists for that address, a password reset link has been
        sent.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        id="email"
        label="Work email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send reset link"}
      </button>
      <Link
        href="/login"
        className="block text-center text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        Return to sign in
      </Link>
    </form>
  );
}
