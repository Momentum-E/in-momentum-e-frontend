import ConfirmPasswordReset from "@/components/auth/ConfirmResetPassword";
import { Suspense } from "react";

export default function ConfirmAndResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPasswordReset />
    </Suspense>
  );
}
