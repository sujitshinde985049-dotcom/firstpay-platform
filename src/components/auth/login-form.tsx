"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(undefined);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setServerError(
        "Unable to sign in. Check your credentials and try again.",
      );
      return;
    }

    const next = searchParams.get("next");
    const redirectUrl = new URL("/auth/redirect", window.location.origin);
    if (next) redirectUrl.searchParams.set("next", next);
    router.replace(`${redirectUrl.pathname}${redirectUrl.search}`);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        id="email"
        label="Work email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {serverError ? (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <Link
        href="/forgot-password"
        className="block text-center text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        Forgot your password?
      </Link>
    </form>
  );
}
