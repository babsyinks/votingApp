import Block from "components/ui/Block";
import Button from "components/ui/Button";
import { electionStatus } from "features/election/electionSlice";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import type { UserAuthStatus } from "../types/userAuthStatus";

export default function HeroSectionLink({
  userIsAuthenticated,
}: UserAuthStatus) {
  const statusOfElection = useSelector(electionStatus);
  const electionEnded = statusOfElection === "active_election_ended";
  const [btnState, setBtnState] = useState({
    msg: "Voting",
    link: "/vote",
    class: "secondary-btn",
  });

  useEffect(() => {
    if (electionEnded) {
      setBtnState({
        msg: "Results",
        link: "/results",
        class: "neutral-btn bg-grey-mute",
      });
    }
  }, [electionEnded]);

  return (
    <Block className="mt-3r">
      {userIsAuthenticated ? (
        <Block type="flex-horz-fs" className="gap-1r">
          <Link to={btnState.link}>
            <Button
              className={btnState.class}
            >{`Go to ${btnState.msg} Page`}</Button>
          </Link>
          <Link to="/dashboard">
            <Button className="neutral-btn bg-blueviolet-cool fw-bold text-black">
              {"Go to Dashboard"}
            </Button>
          </Link>
        </Block>
      ) : (
        <Block type="flex-horz-fs" className="gap-1r">
          <Link to="/signin">
            <Button className="neutral-btn bg-blueviolet-cool fw-bold text-black">
              {"Sign In"}
            </Button>
          </Link>
          <Link to="/signup-start">
            <Button className="primary-btn fw-bold">{"Sign up"}</Button>
          </Link>
        </Block>
      )}
    </Block>
  );
}
