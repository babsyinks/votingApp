import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToastMessage } from "hooks/useToastMessage";
import { userNotAuthenticated } from "features/auth/userAuthSlice";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import ToastMessage from "components/ui/ToastMessage";
import LoginForm from "features/auth/components/LoginForm";
import SocialButtons from "features/auth/components/SocialButtons";
import LoginAccountDoesNotExist from "features/auth/components/LoginAccountDoesNotExist";

export default function Login() {
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();
  const dispatch = useDispatch();
  const error = new URLSearchParams(window.location.search).get("error");
  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      triggerFailureToast(error);
    }
  }, [error, dispatch, triggerFailureToast]);

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <Block className="space-y-4 max-w-md mx-auto">
        <Heading type="h1" className="text-2xl font-semibold">
          Sign in
        </Heading>
        <LoginForm />
        <SocialButtons />
        <LoginAccountDoesNotExist />
      </Block>
    </>
  );
}
