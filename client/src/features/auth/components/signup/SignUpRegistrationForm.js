import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToastMessage } from "hooks/useToastMessage";
import { useAxios } from "hooks/useAxios";
import {
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import { setUserInfo } from "features/user/userSlice";
import { resetUserJustVerified } from "features/auth/verificationSlice";
import AuthFieldUser from "../AuthFieldUser";
import AuthFieldPassword from "../AuthFieldPassword";
import AuthButton from "../AuthButton";
import ToastMessage from "components/ui/ToastMessage";
import AuthPasswordValidator from "../AuthPasswordValidator";

export default function SignUpRegistrationForm({ email }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const { triggerRequest, response, error } = useAxios();
  const dispatch = useDispatch();
  const { toast, triggerFailureToast, toastDetailsSet } = useToastMessage();

  useEffect(() => {
    if (response?.user) {
      dispatch(setUserInfo(response.user));
      dispatch(userAuthenticated(response.user));
      dispatch(resetUserJustVerified());
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      triggerFailureToast(error.message);
    }
  }, [error, triggerFailureToast, dispatch]);

  const register = async () => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/auth/register",
        data: { username, password, email, firstname, lastname },
      },
    });
  };

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthFieldUser
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        placeholder="Firstname"
      />
      <AuthFieldUser
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Lastname"
      />
      <AuthFieldUser
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <AuthFieldPassword
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthButton onClick={register} disabled={!passwordValid}>
        Register
      </AuthButton>
      <AuthPasswordValidator
        password={password}
        setPasswordValid={setPasswordValid}
      />
    </>
  );
}
