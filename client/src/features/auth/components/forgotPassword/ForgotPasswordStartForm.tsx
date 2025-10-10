import { useState, ChangeEvent } from "react";
import AuthFieldEmail from "../AuthFieldEmail";
import ForgotPasswordCommonForm from "./ForgotPasswordCommonForm";

export default function ForgotPasswordStartForm(): JSX.Element {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <ForgotPasswordCommonForm
      path="/forgot-password"
      data={{ email }}
      buttonLabel="Send Reset Link"
      clearField={() => setEmail("")}
    >
      <AuthFieldEmail value={email} onChange={handleEmailChange} />
    </ForgotPasswordCommonForm>
  );
}
