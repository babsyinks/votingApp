import { useNavigate } from "react-router-dom";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";
import Button from "components/ui/Button";
import Container from "layout/Container";

export default function ResultsNone() {
  const navigate = useNavigate();
  return (
    <Container height="auto">
      <Heading type="h1" className="text-red-cool ta-center">
        There Is No Election Result
      </Heading>
      <Paragraph className="p-10 w-50p">
        You are seeing this page because no live election has been held or the
        last live election results have been deleted. To start a new live
        election, contact the admin through the help page and request for a new
        live election to be scheduled.
      </Paragraph>
      <Heading type="h2" className="p-10">
        What Would You Like To Do?
      </Heading>
      <Block type="flex-horz-sb">
        <Button className="primary-btn m-20 ml-5" onClick={() => navigate("/")}>
          Go To Home Page
        </Button>
        <Button
          className="secondary-btn mr-5"
          onClick={() => navigate("/help")}
        >
          Go To Help Page
        </Button>
      </Block>
    </Container>
  );
}
