import { useState, useEffect } from "react";
import Block from "components/ui/Block";
import Paragraph from "components/ui/Paragraph";
import AuthButton from "../AuthButton";
import ToastMessage from "components/ui/ToastMessage";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";

export default function ForgotPasswordCommonForm({
  path,
  data,
  buttonLabel,
  buttonDisabled = false,
  clearField,
  children,
}) {
  const [message, setMessage] = useState("");
  const { response, triggerRequest, error } = useAxios();
  const { toast, triggerSuccessToast, triggerFailureToast, toastDetailsSet } =
    useToastMessage();

  useEffect(() => {
    if (response?.message) {
      const successStatusMessage =
        path === "/forgot-password"
          ? "The link is in your inbox or spam folder. It will expire in 10 minutes"
          : "Click to sign in";
      triggerSuccessToast(response.message);
      clearField();
      setMessage(successStatusMessage);
    }
  }, [response, clearField, path, triggerSuccessToast]);

  useEffect(() => {
    if (error) {
      triggerFailureToast(error.message);
    }
  }, [error, triggerFailureToast]);

  const forgotPasswordHandler = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: `/api/v1/auth${path}`,
        data,
      },
    });
  };

  return (
    <Block className="mt-1r">
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      {children}
      <AuthButton onClick={forgotPasswordHandler} disabled={buttonDisabled}>
        {buttonLabel}
      </AuthButton>
      {message &&
        (path === "/forgot-password" ? (
          <Paragraph>{message}</Paragraph>
        ) : (
          <AuthAlternativeAccessMeans btnLabel={message} route="/signin" />
        ))}
    </Block>
  );
}
