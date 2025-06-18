import { useNavigate } from "react-router-dom";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Button from "components/ui/Button";
import Container from "layout/Container";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Heading type="h1" className="text-red-cool p-10 ta-center">
        This Page Does Not Exist
      </Heading>
      <Heading type="h2" className="p-10">
        What Would You Like To Do?
      </Heading>
      <Block type="flex-horz-sb">
        <Button className="primary-btn m-20 ml-5" onClick={() => navigate("/")}>
          Go To Home Page
        </Button>
        <Button className="secondary-btn mr-5" onClick={() => navigate("/vote")}>
          Go To Voting Page
        </Button>
      </Block>
    </Container>
  );
};

export default NotFound;
