import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { useAxios } from "../../../hooks/useAxios";
import { useParticles } from "../hooks/useParticles";

import { useRemoveFromLocalStorage } from "../../../hooks/useLocalStorage";

import { selectLoadingState } from "../../../app/loaderSlice";
import ElectivePositionDetails from "./ElectivePositionDetails";
import { userIsAdmin } from "../../auth/userAuthSlice";
import {
  userAuth,
  userAuthenticated,
  userNotAuthenticated,
} from "../../auth/userAuthSlice";
import {
  timerData,
  fetchThenSetCurrentTimerStatus,
} from "../../timer/timerSlice";
import { userInfo, setUserInfo } from "../../user/userSlice";
import { allElectionData, setAllElectionData } from "../electionSlice";
import LiveTimer from "../../../LiveTimer";
import "./VoteNominees.css";
import params from "../config/particlesConfig";

const VoteNominees = () => {
  const [failedFetch, setFailedFetch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector(userInfo);
  const userAdminAccess = useSelector(userIsAdmin);
  const userIsAuthenticated = useSelector(userAuth);
  const timer = useSelector(timerData);
  const isLoading = useSelector(selectLoadingState);
  const listOfElectionData = useSelector(allElectionData);

  const { removeToken, setRemoveToken } = useRemoveFromLocalStorage("token");
  const { response, error, triggerRequest } = useAxios();
  const { particlesInit, particlesLoaded } = useParticles();

  useEffect(() => {
    if (!userIsAuthenticated && removeToken) {
      navigate("/");
    }
  }, [navigate, removeToken, userIsAuthenticated]);

  useEffect(() => {
    const fetch = async () => {
      await triggerRequest({
        params: {
          method: "GET",
          url: "/election/details",
        },
      });
    };
    fetch();
  }, [triggerRequest]);

  useEffect(() => {
    if (response) {
      const { electionData, userId, username, role } = response;
      dispatch(setAllElectionData(electionData));
      dispatch(userAuthenticated({ username, userId, role }));
      dispatch(setUserInfo({ username, userId, role }));
      dispatch(fetchThenSetCurrentTimerStatus());
      if (electionData.length === 0) {
        setFailedFetch(true);
      }
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      navigate("/");
    }
  }, [error, dispatch, navigate]);

  const handleLogin = async () => {
    try {
      if (userAdminAccess) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const logOut = () => {
    setRemoveToken(true);
    dispatch(userNotAuthenticated());
  };
  if (userIsAuthenticated) {
    const { username, role } = userDetails;
    if (timer.startDate === null && timer.endDate === null) {
      navigate("/");
    } else {
      if (!failedFetch) {
        return (
          <div className="voteNomineesWrapper" style={{ backgroundImage: "" }}>
            <Particles
              id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
              options={params}
            />

            <div className="headerTab">
              <i className="fas fa-home" onClick={goHome}></i>
              <div>
                Welcome{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {username.toLowerCase()}.
                </span>{" "}
                Please Proceed To Vote.
              </div>
              {role === "admin" ? (
                <button onClick={handleLogin} className={isLoading ? "sp" : ""}>
                  {isLoading ? (
                    <i className="fas fa-circle-notch fa-spin fa-xs"></i>
                  ) : (
                    "Access Admin"
                  )}
                </button>
              ) : (
                <button onClick={logOut}>Log Out</button>
              )}
            </div>
            {timer.endDate && (
              <div className="voteTm">
                <LiveTimer electionEndTime={timer.endDate} />
              </div>
            )}
            {listOfElectionData.map((contestantsDetailsByPosition, i) => {
              return (
                <ElectivePositionDetails
                  contestantsDetailsByPosition={contestantsDetailsByPosition}
                  key={i}
                />
              );
            })}
          </div>
        );
      } else {
        return (
          <div className="voteNomineesWrapper">
            <div>
              <button
                style={{
                  padding: "10px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
                onClick={handleLogin}
              >
                Add Contestants
              </button>
              <h2
                style={{ textAlign: "center", height: "100vh", color: "white" }}
              >
                There Is Currently No Election Or Election Data Could Not Be
                Fetched
              </h2>
            </div>
          </div>
        );
      }
    }
  } else {
    navigate("/");
  }
};

export default memo(VoteNominees);
