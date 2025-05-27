import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAddToLocalStorage } from "./hooks/useLocalStorage";
import { useAxios } from "./hooks/useAxios";
import { useToastMessage } from "./hooks/useToastMessage";
import "./RegisterOrLogin.css";
import { selectLoadingState } from "./app/loaderSlice";
import ComposeComp from "./components/ComposeComp";
import ToastMessage from "./components/ui/ToastMessage";
import {
  userAuthenticated,
  userNotAuthenticated,
  userAuth,
} from "./features/auth/userAuthSlice";
import {
  timerData,
  fetchThenSetCurrentTimerStatus,
} from "./features/timer/timerSlice";
import { setUserInfo } from "./features/user/userSlice";
import LiveTimer from "./LiveTimer";
import Result from "./Result";
import TimerComp from "./TimerComp";

function RegisterOrLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("Register");
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoadingState);
  const timer = useSelector(timerData);
  const userIsAuthenticated = useSelector(userAuth);

  const dispatch = useDispatch();
  const { token, setToken } = useAddToLocalStorage("token");
  const { response, error, triggerRequest, clearError } = useAxios();
  const { toast, triggerToast, toastDetailsSet } = useToastMessage();

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  useEffect(() => {
    if (userIsAuthenticated && token) {
      navigate("/vote");
    }
  }, [token, navigate, userIsAuthenticated]);

  useEffect(() => {
    if (response) {
      const { token, user } = response;
      setToken(token);
      dispatch(setUserInfo(user));
      dispatch(userAuthenticated(user));
    }
  }, [response, dispatch, setToken, username]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      action === "Register"
        ? triggerToast({
            status: "failed",
            message: `${username} username already exists.`,
          })
        : triggerToast({
            status: "failed",
            message: "Username or password is incorrect",
          });
      clearError();
    }
  }, [error, triggerToast, username, action, dispatch, clearError]);

  async function handleSubmit() {
    await triggerRequest({
      params: {
        method: "POST",
        url: `/auth/${action.toLowerCase()}`,
        data: { username, password },
      },
    });
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  if (timer.startDate && timer.startDate > 0) {
    return (
      <ComposeComp>
        <h2 className="eleMsg_start">The Election Will Start In:</h2>
        <TimerComp endTime={timer.startDate}></TimerComp>
        <h2 className="eleMsg_cb">Please Come Back To Vote By Then.</h2>
      </ComposeComp>
    );
  } else if (timer.startDate === null && timer.endDate === null) {
    return <Result />;
  } else {
    return (
      <div className="container_div">
        {toastDetailsSet() && <ToastMessage toast={toast} />}
        {timer.endDate && <LiveTimer electionEndTime={timer.endDate} />}
        <h1>Demo School Alumni Voting App</h1>
        <div className="wrapper_div">
          <h2>
            Time To Vote! <img src="images/vote.png" alt="vote icon"></img>
          </h2>
          <div className="content_div">
            <div className="register_login sizer">
              <span
                id={action === "Register" ? "currentSelected" : ""}
                className="labelSelect"
                onClick={() => setAction("Register")}
              >
                Register
              </span>
              <span
                id={action === "Login" ? "currentSelected" : ""}
                className="labelSelect"
                onClick={() => setAction("Login")}
              >
                Login
              </span>
              <div>
                <div className="input_box">
                  <label>Username</label>
                  <input
                    type={"text"}
                    value={username}
                    onChange={handleUsernameChange}
                  ></input>
                </div>
                <div className="input_box">
                  <label>Password</label>
                  <input
                    type={"password"}
                    value={password}
                    onChange={handlePasswordChange}
                  ></input>
                </div>
                <div className="action_btn">
                  <button
                    onClick={handleSubmit}
                    disabled={!username || !password}
                  >
                    {isLoading ? (
                      <i className="fas fa-circle-notch fa-spin fa-xs"></i>
                    ) : (
                      action
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div id="group_px" className="sizer">
              <img src="images/group_px.png" alt="supporting voting"></img>
            </div>
          </div>
        </div>
        <footer style={{ color: "white" }}>
          &copy; Corestack Tech {new Date().getFullYear()}
        </footer>
      </div>
    );
  }
}

export default memo(RegisterOrLogin);
