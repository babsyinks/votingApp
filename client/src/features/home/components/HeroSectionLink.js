import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { electionStatus } from "features/election/electionSlice";
import Block from "../../../components/ui/Block";
import Button from "../../../components/ui/Button";

export default function HeroSectionLink({ userIsAuthenticated }) {
  const statusOfElection = useSelector(electionStatus);
  const btnStateMsg = { primary: "Voting", secondary: "Vote" };
  const electionEnded = statusOfElection === "active_election_ended";
  if (electionEnded) {
    btnStateMsg.primary = "Results";
    btnStateMsg.secondary = "View Results";
  }
  return (
    <Block className="mt-3r">
      {userIsAuthenticated ? (
        <Link to={electionEnded ? "/results" : "/vote"}>
          <Button className="primary-btn">{`Go to ${btnStateMsg.primary} Page`}</Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button className="secondary-btn">{`Sign In to ${btnStateMsg.secondary}`}</Button>
        </Link>
      )}
    </Block>
  );
}
