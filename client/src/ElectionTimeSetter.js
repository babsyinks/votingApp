import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "./hooks/useToastMessage";

import {
  fetchThenSetCurrentTimerStatus,
  timerData,
  setTimerData,
} from "./features/timer/timerSlice";
import { adminAuth } from "./features/auth/admin/adminAuthSlice";

import ComposeComp from "./components/ComposeComp";
import ToastMessage from "./components/ui/ToastMessage";
import "./ElectionTimeSetter.css";

function ElectionTimeSetter() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [enableDone, SetEnableDone] = useState(false);
  const [electionStartDate, setElectionStartDate] = useState(0);
  const [electionEndDate, setElectionEndDate] = useState(0);
  const navigate = useNavigate();
  const timer = useSelector(timerData);
  const adminAuthenticated = useSelector(adminAuth);
  const dispatch = useDispatch();
  const { toast, triggerToast, toastDetailsSet } = useToastMessage();

    const setSuccessMessage = (message) => {
    setMessage(message, "success");
  };

  const setFailureMessage = (message) => {
    setMessage(message, "failed");
  };

  const setMessage = (message, status) => {
    SetEnableDone(false);
    triggerToast({
      status,
      message,
    });
  };

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  useEffect(() => {
    let timeout;
    if (startDate && startTime && endDate && endTime) {
      const startDateMilliseconds = startDate.split("-");
      const startDateMillisecondsTuned = startDateMilliseconds.map((v, i) => {
        if (i === 1) {
          return +v - 1;
        } else {
          return +v;
        }
      });
      const startTimeMilliseconds = startTime.split(":");
      const startTimeMillisecondsTuned = startTimeMilliseconds.map((v) => +v);
      const startTimeStamp = new Date(
        ...startDateMillisecondsTuned,
        ...startTimeMillisecondsTuned,
      ).getTime();

      const endDateMilliseconds = endDate.split("-");
      const endDateMillisecondsTuned = endDateMilliseconds.map((v, i) => {
        if (i === 1) {
          return +v - 1;
        } else {
          return +v;
        }
      });
      const endTimeMilliseconds = endTime.split(":");
      const endTimeMillisecondsTuned = endTimeMilliseconds.map((v) => +v);
      const endTimeStamp = new Date(
        ...endDateMillisecondsTuned,
        ...endTimeMillisecondsTuned,
      ).getTime();

      if (startTimeStamp < Date.now()) {
        setFailureMessage("Election Date Should Not Be Set To The Past");
      } else if (endTimeStamp - startTimeStamp >= 0) {
        SetEnableDone(true);
        setElectionStartDate(startTimeStamp);
        setElectionEndDate(endTimeStamp);
      } else {
        setFailureMessage("End Date Is Lesser Than Start Date");
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, startTime, endDate, endTime]);

  const handleSetStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleSetStartTime = (e) => {
    setStartTime(e.target.value);
  };

  const handleSetEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleSetEndTime = (e) => {
    setEndTime(e.target.value);
  };

  const setTimer = async () => {
    const timerObj = { startDate: electionStartDate, endDate: electionEndDate };
    try {
      const {
        data: { startDate, endDate },
      } = await axios.post(
        // "https://votingapp-pmev.onrender.com/timer/set",
        "/timer/set",
        timerObj,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": localStorage.getItem("token"),
          },
        },
      );
      if (startDate && endDate) {
        dispatch(setTimerData({ startDate, endDate }));
        setSuccessMessage("Timer Successfully Set!");
      } else {
        setFailureMessage("Timer Could Not Be Set!");
      }
    } catch (error) {
      console.log(error.message);
      setFailureMessage("Timer Not Set!");
    }
  };

  const cancelTimer = async () => {
    try {
      const {
        data: { startDate, endDate },
        // "https://votingapp-pmev.onrender.com/timer/cancel"
      } = await axios.get("/timer/cancel", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("token"),
        },
      });
      dispatch(setTimerData({ startDate, endDate }));
      setSuccessMessage("Timer Successfully Cancelled!");
    } catch (error) {
      console.log(error.message);
      setFailureMessage("Timer Could Not Be Cancelled!");
    }
  };

  if (adminAuthenticated) {
    return (
      <ComposeComp linearGrad="linear-gradient(to right, rgb(135 243 135), rgb(227 247 119), rgb(101 223 251))">
        <>
          <div className="elemWrap">
            {toastDetailsSet() && <ToastMessage toast={toast} />}
            <div>
              <label>Election Start Day:</label>{" "}
              <input
                type="date"
                onChange={handleSetStartDate}
                value={startDate}
              ></input>
            </div>
            <div>
              <label>Election Start Time:</label>{" "}
              <input
                type="time"
                onChange={handleSetStartTime}
                value={startTime}
              ></input>
            </div>
            <div>
              <label>Election End Day:</label>{" "}
              <input
                type="date"
                onChange={handleSetEndDate}
                value={endDate}
              ></input>
            </div>
            <div>
              <label>Election End Time:</label>{" "}
              <input
                type="time"
                onChange={handleSetEndTime}
                value={endTime}
              ></input>
            </div>
          </div>
          {enableDone && (
            <button
              value="Done"
              className="doneBtn timerBtns"
              onClick={setTimer}
            >
              Done
            </button>
          )}
          {timer.electionStartSet && timer.electionEndSet && (
            <button
              value="Cancel Timer"
              className="cancelTimerBtn timerBtns"
              onClick={cancelTimer}
            >
              Cancel Timer
            </button>
          )}
        </>
      </ComposeComp>
    );
  } else {
    navigate("/vote");
    return null;
  }
}

export default memo(ElectionTimeSetter);
