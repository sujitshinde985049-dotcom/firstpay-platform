import { AuthCard } from "@/components/auth/auth-card";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      description="Use a unique password with at least 12 characters."
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
