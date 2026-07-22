import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="We will send recovery instructions if the account exists."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
