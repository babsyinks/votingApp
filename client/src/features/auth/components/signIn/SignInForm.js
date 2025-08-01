import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToastMessage } from "hooks/useToastMessage";
import { useAxios } from "hooks/useAxios";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import {
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import { setUserInfo } from "features/user/userSlice";
import isEmail from "validator/lib/isEmail";
import AuthFieldUser from "../AuthFieldUser";
import AuthFieldPassword from "../AuthFieldPassword";
import AuthButton from "../AuthButton";
import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";
import ToastMessage from "components/ui/ToastMessage";

export default function SignInForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { triggerRequest, response, error } = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();
  const redirect = useStatusOfElectionRedirect();

  useEffect(() => {
    if (redirect.length > 0) {
      navigate(redirect, { replace: true });
    }
  }, [redirect, navigate]);

  useEffect(() => {
    if (response?.user) {
      dispatch(setUserInfo(response.user));
      dispatch(userAuthenticated(response.user));
    }
  }, [response, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      triggerFailureToast(error.message);
    }
  }, [error, triggerFailureToast, dispatch]);

  const signIn = async () => {
    const data = { password };
    if (isEmail(usernameOrEmail)) {
      data.email = usernameOrEmail;
    } else {
      data.username = usernameOrEmail;
    }
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/signin",
        data,
      },
    });
  };

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthFieldUser
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        placeholder="Username or Email"
      />
      <AuthFieldPassword
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthButton
        onClick={signIn}
        disabled={!(usernameOrEmail.length > 0 && password.length > 0)}
      >
        Sign In
      </AuthButton>
      <AuthAlternativeAccessMeans
        btnLabel="Forgot password?"
        route="/forgot-password"
      />
    </>
  );
}
