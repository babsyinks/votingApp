import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { electionStatus } from "features/election/electionSlice";
import Block from "components/ui/Block";
import Button from "components/ui/Button";

export default function HeroSectionLink({ userIsAuthenticated }) {
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
        <Link to={btnState.link}>
          <Button
            className={btnState.class}
          >{`Go to ${btnState.msg} Page`}</Button>
        </Link>
      ) : (
        <Block type="flex-horz-fs" className="gap-1r">
          <Link to="/signin">
            <Button className="neutral-btn bg-blueviolet-cool">{`Sign In`}</Button>
          </Link>
          <Link to="/signup-start">
            <Button className="primary-btn">{`Sign up`}</Button>
          </Link>
        </Block>
      )}
    </Block>
  );
}
