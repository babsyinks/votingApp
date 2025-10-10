import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Block from "components/ui/Block";
import AuthFieldEmail from "../AuthFieldEmail";
import AuthButton from "../AuthButton";
import ToastMessage from "components/ui/ToastMessage";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";

/**
 * This component requests the email of the user signing up so that the sign up code can be
 * sent to it.
 */
export default function SignUpStartAccountDoesNotExist(): JSX.Element {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();
  const { response, triggerRequest, error } = useAxios();
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();

  useEffect(() => {
    if (response?.success) {
      navigate(`/verify-code?email=${encodeURIComponent(email)}`);
    }
  }, [response, email, navigate]);

  useEffect(() => {
    if (error) {
      triggerFailureToast(error.message);
    }
  }, [error, triggerFailureToast]);

  const requestSignUpCode = async (): Promise<void> => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/request-signup-code",
        data: { email },
      },
    });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  return (
    <Block className="mt-1r">
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthFieldEmail value={email} onChange={handleEmailChange} />
      <AuthButton onClick={requestSignUpCode}>Next</AuthButton>
    </Block>
  );
}
