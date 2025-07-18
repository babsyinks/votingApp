import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Block from "components/ui/Block";
import AuthFieldEmail from "../AuthFieldEmail";
import AuthButton from "../AuthButton";
import ToastMessage from "components/ui/ToastMessage";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";

export default function SignUpStartAccountDoesNotExist() {
  const [email, setEmail] = useState("");
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

  const requestSignUpCode = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/request-signup-code",
        data: { email },
      },
    });
  };

  return (
    <Block className="mt-1r">
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthFieldEmail
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthButton onClick={requestSignUpCode}>Next</AuthButton>
    </Block>
  );
}
