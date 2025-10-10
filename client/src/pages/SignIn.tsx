import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useWindowSize from "hooks/useWindowSize";
import { useToastMessage } from "hooks/useToastMessage";
import { userNotAuthenticated } from "features/auth/userAuthSlice";
import ToastMessage from "components/ui/ToastMessage";
import Hr from "components/ui/Hr";
import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import SignInForm from "features/auth/components/signIn/SignInForm";
import SocialButtons from "features/auth/components/socials/SocialButtons";
import SignInAccountDoesNotExist from "features/auth/components/signIn/SignInAccountDoesNotExist";

export default function SignIn() {
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();
  const dispatch = useDispatch();
  const error = new URLSearchParams(window.location.search).get("error");
  const { height } = useWindowSize();
  const mb = height < 650 ? "mb-1p5r" : "";
  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      triggerFailureToast(error);
    }
  }, [error, dispatch, triggerFailureToast]);

  return (
    <AuthFrame className={mb}>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthHeading>Sign in</AuthHeading>
      <SignInForm />
      <Hr className="neumorphic-hr-line"/>
      <SocialButtons />
      <SignInAccountDoesNotExist />
    </AuthFrame>
  );
}
