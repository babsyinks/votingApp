import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import InputText from "components/ui/InputText";
import Block from "components/ui/Block";
import Button from "components/ui/Button";
import Heading from "components/ui/Heading";
import ToastMessage from "components/ui/ToastMessage";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { useDispatch } from "react-redux";
import { setUserJustVerified } from "features/auth/verificationSlice";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { response, triggerRequest, error } = useAxios();
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();

  useEffect(() => {
    if (response?.success) {
      dispatch(setUserJustVerified(response.success));
      navigate(`/register?email=${encodeURIComponent(email)}`, {
        replace: true,
      });
    }
  }, [response, email, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      triggerFailureToast("Invalid sign up code!");
    }
  }, [error, triggerFailureToast]);

  async function verify() {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/auth/verify-signup-code",
        data: { email, code },
      },
    });
  }

  return (
    <Block className="space-y-4 max-w-md mx-auto">
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <Heading type="h1" className="text-2xl font-semibold">
        {`Enter the 6-digit code sent to ${email}`}
      </Heading>
      <InputText
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <Button
        className="btn-primary w-full"
        onClick={verify}
        disabled={code.length !== 6}
      >
        Verify
      </Button>
    </Block>
  );
}
