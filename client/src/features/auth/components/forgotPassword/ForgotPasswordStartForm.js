import { useState } from "react";
import AuthFieldEmail from "../AuthFieldEmail";
import ForgotPasswordCommonForm from "./ForgotPasswordCommonForm";

export default function ForgotPasswordStartForm() {
  const [email, setEmail] = useState("");

  return (
    <ForgotPasswordCommonForm
      path="/forgot-password"
      data={{ email }}
      buttonLabel="Send Reset Link"
      clearField={() => setEmail("")}
    >
      <AuthFieldEmail
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </ForgotPasswordCommonForm>
  );
}
