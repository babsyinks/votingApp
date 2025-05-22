import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const goVote = () => {
    navigate("/vote");
  };

  const goHome = () => {
    navigate("/");
  };
  return (
    <div className="nf_wrapper">
      <h1>This Page Does Not Exist</h1>
      <h2>What Will You Like To Do?</h2>
      <div>
        <button id="go_home" onClick={goHome} value={"Go To Home Page"}>
          Go To Home Page
        </button>
        <button id="go_vote" onClick={goVote} value={"Go To Voting Page"}>
          Go To Voting Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
