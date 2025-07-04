import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import Block from "components/ui/Block";
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
        url: "/auth/request-signup-code",
        data: { email },
      },
    });
  };

  return (
    <Block type="flex-vert">
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="btn-primary w-full" onClick={requestSignUpCode}>
        Next
      </Button>
    </Block>
  );
}
