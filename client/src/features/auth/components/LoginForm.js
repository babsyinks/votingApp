import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToastMessage } from "hooks/useToastMessage";
import { useAxios } from "hooks/useAxios";
import useStatusOfElectionRedirect from "../hooks/useStatusOfElectionRedirect";
import {
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import { setUserInfo } from "features/user/userSlice";
import isEmail from "validator/lib/isEmail";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import ToastMessage from "components/ui/ToastMessage";

export default function LoginForm() {
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

  const login = async () => {
    const data = { password };
    if (isEmail(usernameOrEmail)) {
      data.email = usernameOrEmail;
    } else {
      data.username = usernameOrEmail;
    }
    await triggerRequest({
      params: {
        method: "POST",
        url: "/auth/login",
        data,
      },
    });
  };

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <Input
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        placeholder="Username or Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button
        className="btn-primary w-full"
        onClick={login}
        disabled={!(usernameOrEmail.length > 0 && password.length > 0)}
      >
        Login
      </Button>
    </>
  );
}
