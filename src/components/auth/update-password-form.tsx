"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(12, "Use at least 12 characters."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
type UpdatePasswordValues = z.infer<typeof schema>;

export function UpdatePasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    setServerError(undefined);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setServerError(
        "Unable to update the password. Request a new reset link.",
      );
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        id="password"
        label="New password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {serverError ? (
        <p className="text-sm text-red-600">{serverError}</p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
