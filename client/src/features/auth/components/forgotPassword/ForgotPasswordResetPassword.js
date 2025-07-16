import { useState } from "react";
import { useParams } from "react-router-dom";
import ForgotPasswordCommonForm from "./ForgotPasswordCommonForm";
import Block from "components/ui/Block";
import AuthFrame from "../AuthFrame";
import AuthFieldPassword from "../AuthFieldPassword";
import AuthPasswordValidator from "../AuthPasswordValidator";
import AuthValidationIndicator from "../AuthValidationIndicator";

export default function ForgotPasswordResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordDup, setPasswordDup] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const { resetCode } = useParams();
  const passwordMatch = password === passwordDup;

  return (
    <>
      <ForgotPasswordCommonForm
        path="/reset-password"
        data={{ resetCode, password }}
        buttonLabel="Update Password"
        clearField={() => setPassword("")}
        buttonDisabled={!passwordValid}
      >
        <AuthFieldPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter New Password"
        />
        <AuthFieldPassword
          value={passwordDup}
          onChange={(e) => setPasswordDup(e.target.value)}
          placeholder="Enter New Password Again"
        />
      </ForgotPasswordCommonForm>
      {password.length > 0 && passwordDup.length > 0 && (
        <AuthFrame type="flex" isFull={false} className="align-items-start">
          <Block
            type="flex"
            className={`${passwordMatch ? "text-green" : "text-red"} flex align-items-center justify-content-center mb-0p5r text-base transition-color`}
          >
            <AuthValidationIndicator
              label={passwordMatch ? "Password Match" : "Password Mismatch"}
              isValid={passwordMatch}
              usePresetWidths={false}
            />
          </Block>
        </AuthFrame>
      )}
      {password.length > 0 && passwordDup.length === 0 && (
        <AuthPasswordValidator
          password={password}
          setPasswordValid={setPasswordValid}
        />
      )}
    </>
  );
}
