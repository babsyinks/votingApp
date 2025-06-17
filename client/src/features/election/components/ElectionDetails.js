import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import {
  userAuth,
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import { setUserInfo } from "features/user/userSlice";
import {
  allElectionData,
  setAllElectionData,
  updateElectionStatusFromTimer,
} from "features/election/electionSlice";
import { timerData } from "features/timer/timerSlice";
import ElectionDetailsAllData from "features/election/components/ElectionDetailsAllData";
import ElectionDetailsNoData from "features/election/components/ElectionDetailsNoData";

const ElectionDetails = () => {
  const [failedFetch, setFailedFetch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userIsAuthenticated = useSelector(userAuth);
  const listOfElectionData = useSelector(allElectionData);
  const timer = useSelector(timerData);
  const { response, error, triggerRequest } = useAxios();

  useEffect(() => {
    if (!userIsAuthenticated) {
      navigate("/");
    }
  }, [navigate, userIsAuthenticated]);

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
      dispatch(updateElectionStatusFromTimer(timer));
      if (electionData.length === 0) {
        setFailedFetch(true);
      }
    }
  }, [response, dispatch, timer]);

  useEffect(() => {
    if (error) {
      dispatch(userNotAuthenticated());
      navigate("/");
    }
  }, [error, dispatch, navigate]);

  if (failedFetch) {
    return <ElectionDetailsNoData />;
  } else {
    return <ElectionDetailsAllData listOfElectionData={listOfElectionData} />;
  }
};

export default memo(ElectionDetails);
