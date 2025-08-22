import { useAxios } from "hooks/useAxios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import { electionStatus } from "features/election/electionSlice";
import {
  userAuth,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import ResultsAll from "features/results/components/ResultsAll";
import ResultsRemoved from "features/results/components/ResultsRemoved";
import ResultsNotAvailable from "features/results/components/ResultsNotAvailable";

function Results() {
  const [result, setResult] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const { response, triggerRequest, error } = useAxios();
  const statusOfElection = useSelector(electionStatus);
  const dispatch = useDispatch();
  const userIsAuthenticated = useSelector(userAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userIsAuthenticated) {
      navigate("/signin");
    }
  }, [navigate, userIsAuthenticated]);

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  useEffect(() => {
    const resultStatus = async () => {
      await triggerRequest({
        params: {
          method: "GET",
          url: "/api/v1/election/details",
        },
      });
      // "https://votingapp-pmev.onrender.com/api/v1/election/details",
    };
    resultStatus();
  }, [triggerRequest]);

  useEffect(() => {
    if (response) {
      setResult(response.electionData);
      setResultsLoaded(true);
    }
  }, [response]);

    useEffect(() => {
      if (error) {
        dispatch(userNotAuthenticated());
        navigate("/signin");
      }
    }, [error, dispatch, navigate]);

  if (statusOfElection === "active_election_ended") {
    if (resultsLoaded) {
      if (result.length > 0) return <ResultsAll result={result} />;
      else return <ResultsRemoved />;
    } else {
      return null;
    }
  } else {
    if (resultsLoaded) return <ResultsNotAvailable />;
  }
}

export default Results;
