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
} from "features/election/electionSlice";
import ElectionDetailsAllData from "features/election/components/ElectionDetailsAllData";
import ElectionDetailsNoData from "features/election/components/ElectionDetailsNoData";
import { ElectionCategory } from "../types/electionCategoryType";

interface ElectionResponse {
  electionData: ElectionCategory[];
  userId: string;
  username: string;
  role: string;
}

const ElectionDetails = () => {
  const [failedFetch, setFailedFetch] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userIsAuthenticated: boolean = useSelector(userAuth);
  const listOfElectionData = useSelector(allElectionData);

  const { response, error, triggerRequest } = useAxios<ElectionResponse>();

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
          url: "/api/v1/election/details",
        },
      });
    };
    fetch();
  }, [triggerRequest]);

  useEffect(() => {
    if (response) {
      const { electionData, userId, username, role } = response;

      dispatch(setAllElectionData(electionData));
      dispatch(userAuthenticated({ role }));
      dispatch(setUserInfo({ username, userId, role }));

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

  if (failedFetch) {
    return <ElectionDetailsNoData />;
  }

  return <ElectionDetailsAllData listOfElectionData={listOfElectionData} />;
};

export default memo(ElectionDetails);
