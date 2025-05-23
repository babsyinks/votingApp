import React, { useEffect, useState, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useAxios } from "../../../hooks/useAxios";

import { useRemoveFromLocalStorage } from "../../../hooks/useLocalStorage";

import { selectLoadingState } from "../../../app/loaderSlice";
import ElectivePositionDetails from "./ElectivePositionDetails";
import { userIsAdmin } from "../../auth/user/userAuthSlice";
import {
  userAuth,
  userAuthenticated,
  userNotAuthenticated,
} from "../../auth/user/userAuthSlice";
import {
  timerData,
  fetchThenSetCurrentTimerStatus,
} from "../../timer/timerSlice";
import { userInfo, setUserInfo } from "../../user/userSlice";
import { allElectionData, setAllElectionData } from "../electionSlice";
import LiveTimer from "../../../LiveTimer";
import "./VoteNominees.css";

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

  // const [token] = useAddToLocalStorage("token");
  const [removeToken, setRemoveToken] = useRemoveFromLocalStorage("token");
  const { response, error, triggerRequest } = useAxios();

  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log(container);
  }, []);

  const params = {
    fps_limit: 60,
    interactivity: {
      detect_on: "canvas",
      events: {
        onclick: { enable: true, mode: "push" },
        onhover: {
          enable: true,
          mode: "repulse",
          parallax: { enable: false, force: 60, smooth: 10 },
        },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        attract: { distance: 200, duration: 0.4, factor: 5 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      line_linked: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
        bounce: false,
        direction: "none",
        enable: true,
        out_mode: "out",
        random: false,
        speed: 2,
        straight: false,
      },
      number: { density: { enable: true, value_area: 800 }, value: 80 },
      opacity: {
        anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
        random: false,
        value: 0.5,
      },
      shape: {
        character: {
          fill: false,
          font: "Verdana",
          style: "",
          value: "*",
          weight: "400",
        },
        image: {
          height: 100,
          replace_color: true,
          src: "images/github.svg",
          width: 100,
        },
        polygon: { nb_sides: 5 },
        stroke: { color: "#000000", width: 0 },
        type: "circle",
      },
      size: {
        anim: { enable: false, size_min: 0.1, speed: 40, sync: false },
        random: true,
        value: 5,
      },
    },
    polygon: {
      draw: { enable: false, lineColor: "#ffffff", lineWidth: 0.5 },
      move: { radius: 10 },
      scale: 1,
      type: "none",
      url: "",
    },
    retina_detect: true,
  };

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
