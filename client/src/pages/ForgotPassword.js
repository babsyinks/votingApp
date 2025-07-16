import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import ForgotPasswordStartForm from "features/auth/components/forgotPassword/ForgotPasswordStartForm";

export default function ForgotPassword() {
  return (
    <AuthFrame>
      <AuthHeading>Forgot Password</AuthHeading>
      <ForgotPasswordStartForm />
    </AuthFrame>
  );
}
