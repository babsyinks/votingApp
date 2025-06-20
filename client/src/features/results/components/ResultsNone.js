import { useNavigate } from "react-router-dom";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";
import Button from "components/ui/Button";
import Container from "layout/Container";

export default function ResultsNone({ heading, content }) {
  const navigate = useNavigate();
  return (
    <Container height="auto">
      <Heading type="h1" className="text-red-cool ta-center">
        {heading}
      </Heading>
      <Paragraph className="p-10 w-50p">{content}</Paragraph>
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
