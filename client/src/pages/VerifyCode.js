import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Paragraph from "components/ui/Paragraph";
import ToastMessage from "components/ui/ToastMessage";
import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import AuthFieldCode from "features/auth/components/AuthFieldCode";
import AuthButton from "features/auth/components/AuthButton";
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
    if (!email) {
      navigate("/signup-start");
    }
  });

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
        url: "/api/v1/auth/verify-signup-code",
        data: { email, code },
      },
    });
  }

  return (
    <AuthFrame>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthHeading>Enter the 6-digit code sent to</AuthHeading>
      <Paragraph className="text-2xl fw-600 fs-italic">{email}</Paragraph>
      <AuthFieldCode value={code} onChange={(e) => setCode(e.target.value)} />
      <AuthButton onClick={verify} disabled={code.length !== 6}>
        Verify
      </AuthButton>
    </AuthFrame>
  );
}
