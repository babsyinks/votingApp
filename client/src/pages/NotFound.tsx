import Block from "components/ui/Block";
import Button from "components/ui/Button";
import Heading from "components/ui/Heading";
import Container from "layout/Container";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Heading type="h1" className="text-red-cool p-10p ta-center">
        This Page Does Not Exist
      </Heading>
      <Heading type="h2" className="p-10p">
        What Would You Like To Do?
      </Heading>
      <Block type="flex-horz-sb">
        <Button
          className="primary-btn m-20p ml-5p"
          onClick={() => navigate("/")}
        >
          Go To Home Page
        </Button>
        <Button
          className="secondary-btn mr-5p"
          onClick={() => navigate("/vote")}
        >
          Go To Voting Page
        </Button>
      </Block>
    </Container>
  );
};

export default NotFound;
