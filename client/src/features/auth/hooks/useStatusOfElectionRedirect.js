import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { electionStatus } from "features/election/electionSlice";
import { userAuth } from "../userAuthSlice";

const useStatusOfElectionRedirect = () => {
  const userIsAuthenticated = useSelector(userAuth);
  const statusOfElection = useSelector(electionStatus);
  const [redirect, setRedirect] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsAuthenticated) {
      const navLink =
        statusOfElection === "active_election_ended" ? "/results" : "/vote";
      setRedirect(navLink);
    }
  }, [navigate, userIsAuthenticated, statusOfElection]);
  return redirect;
};

export default useStatusOfElectionRedirect;
