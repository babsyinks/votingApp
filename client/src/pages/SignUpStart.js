import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import SignUpStartAccountExists from "features/auth/components/signup/SignUpStartAccountExists";
import SignUpStartAccountDoesNotExist from "features/auth/components/signup/SignUpStartAccountDoesNotExist";

export default function SignUpStart() {
  return (
    <AuthFrame>
      <AuthHeading>Create your account</AuthHeading>
      <SignUpStartAccountDoesNotExist />
      <SignUpStartAccountExists />
    </AuthFrame>
  );
}
