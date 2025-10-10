import { useState, useEffect, ChangeEvent } from "react";
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


export interface SignUpRegistrationFormProps {
  /** The email already verified in the previous step */
  email: string;
}

/**
 * Registration form for signing up users after email verification.
 */
export default function SignUpRegistrationForm({
  email,
}: SignUpRegistrationFormProps): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

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

  const register = async (): Promise<void> => {
    await triggerRequest({
      params: {
        method: "POST",
        url: "/api/v1/auth/register",
        data: { username, password, email, firstname, lastname },
      },
    });
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AuthFieldUser
        value={firstname}
        onChange={handleChange(setFirstname)}
        placeholder="Firstname"
      />
      <AuthFieldUser
        value={lastname}
        onChange={handleChange(setLastname)}
        placeholder="Lastname"
      />
      <AuthFieldUser
        value={username}
        onChange={handleChange(setUsername)}
        placeholder="Username"
      />
      <AuthFieldPassword value={password} onChange={handleChange(setPassword)} />
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
