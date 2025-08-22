import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import { useDispatch } from "react-redux";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import { setUserInfo } from "features/user/userSlice";
import {
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import Paragraph from "components/ui/Paragraph";

export default function OAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { response, triggerRequest, error } = useAxios();
  const redirect = useStatusOfElectionRedirect();

  useEffect(() => {
    if (redirect.length > 0) {
      navigate(redirect, { replace: true });
    }
  }, [redirect, navigate]);

  useEffect(() => {
    const resultStatus = async () => {
      await triggerRequest({
        params: {
          method: "GET",
          url: "http://localhost:3001/api/v1/oauth/me",
        },
      });
      // "https://votingapp-pmev.onrender.com/api/v1/oauth/me",
    };
    resultStatus();
  }, [triggerRequest]);

  useEffect(() => {
    if (response?.user) {
      dispatch(setUserInfo(response.user));
      dispatch(userAuthenticated(response.user));
    }
  }, [response, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      navigate("/signin");
    }
  }, [error, dispatch, navigate]);

  return <Paragraph>Logging you in...</Paragraph>;
}
