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
import InputAndLabelGroup from "components/ui/InputAndLabelGroup";
import Button from "components/ui/Button";
import ToastMessage from "components/ui/ToastMessage";
import RegistrationFormPasswordValidator from "./RegistrationFormPasswordValidator";

export default function RegistrationForm({ email }) {
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
      <InputAndLabelGroup
        label="Firstname:"
        type="text"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <InputAndLabelGroup
        label="Lastname:"
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <InputAndLabelGroup
        label="Username:"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputAndLabelGroup
        label="Password:"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className="btn-primary w-full"
        onClick={register}
        disabled={!passwordValid}
      >
        Register
      </Button>
      <RegistrationFormPasswordValidator
        password={password}
        setPasswordValid={setPasswordValid}
      />
    </>
  );
}
