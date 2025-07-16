import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import ForgotPasswordResetPassword from "features/auth/components/forgotPassword/ForgotPasswordResetPassword";

export default function ForgotPassword() {
  return (
    <AuthFrame>
      <AuthHeading>Reset Password</AuthHeading>
      <ForgotPasswordResetPassword />
    </AuthFrame>
  );
}
