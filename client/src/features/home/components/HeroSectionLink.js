import { Link } from "react-router-dom";
import Block from "../../../components/ui/Block";
import Button from "../../../components/ui/Button";

export default function HeroSectionLink({ userIsAuthenticated }) {
  return (
    <Block className="mt-3r">
      {userIsAuthenticated ? (
        <Link to="/vote">
          <Button className="primary-btn">Go to Voting Page</Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button className="secondary-btn">Sign In to Vote</Button>
        </Link>
      )}
    </Block>
  );
}
