import { useState } from "react";
import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import ForgotPasswordResetPassword from "features/auth/components/forgotPassword/ForgotPasswordResetPassword";

export default function ResetPassword() {
  const [bottomSpacingClass, setBottomSpacingClass] = useState("");
  return (
    <AuthFrame className={bottomSpacingClass}>
      <AuthHeading>Reset Password</AuthHeading>
      <ForgotPasswordResetPassword
        setBottomSpacingClass={setBottomSpacingClass}
      />
    </AuthFrame>
  );
}
