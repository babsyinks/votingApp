import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useToastMessage } from "./hooks/useToastMessage";

import { setTimerData } from "./features/timer/timerSlice";
import ComposeComp from "./components/ComposeComp";
import ToastMessage from "./components/ui/ToastMessage";
import { login } from "./features/auth/admin/adminAuthSlice";

import "./AdminSignin.css";

function AdminSignIn({ resetElection }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast, triggerToast, toastDetailsSet } = useToastMessage();

  const handleSetUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleSetPassword = (e) => {
    setPassword(e.target.value);
  };

  const adminLogin = async () => {
    const alumniInfo = { username, password };
    try {
      const {
        data: { token },
      } = await axios.post(
        // https://votingapp-pmev.onrender.com/auth/login
        "/auth/login",
        alumniInfo,
      );
      if (token) {
        localStorage.setItem("token", token);
      } else {
        setErrorMsg("Invalid Login Credentials!");
      }
      dispatch(login());

      if (resetElection) {
        try {
          await axios.delete(
            // "https://votingapp-pmev.onrender.com/election/delete",
            "/election/delete",
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Auth-Token": localStorage.getItem("token"),
              },
            },
          );
          triggerToast({
            status: "success",
            message: "Election Successfully Ended!!!",
          });
          setTimeout(() => {
            dispatch(setTimerData({}));
            navigate("/");
          }, 6000);
        } catch (error) {
          triggerToast({
            status: "failed",
            message: "Oops Something Went Wrong!!!",
          });
        }
      } else {
        navigate("/admin");
      }
    } catch (error) {
      setErrorMsg("Only An Administrator Can Login!");
    }
  };
  return (
    <ComposeComp>
      <div className="admin_signin_Wrap">
        {toastDetailsSet() && <ToastMessage toast={toast} />}
        <h2>Admin Sign In</h2>
        <div>
          <label>Username:</label>{" "}
          <input
            type="text"
            onChange={handleSetUsername}
            value={username}
            className="admin_input"
          ></input>
        </div>
        <div>
          <label>Password:</label>{" "}
          <input
            type="password"
            onChange={handleSetPassword}
            value={password}
            className="admin_input"
          ></input>
        </div>
      </div>
      {username && password && (
        <button value="Login" className="adminLogin_btn" onClick={adminLogin}>
          Login
        </button>
      )}
      {errorMsg && <div className="errorAdmin">{errorMsg}</div>}
    </ComposeComp>
  );
}

export default AdminSignIn;
