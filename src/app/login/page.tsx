import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in with your FirstPay account. Access is invitation-only."
    >
      <Suspense
        fallback={
          <p className="text-sm text-slate-500">Loading secure sign-in…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
