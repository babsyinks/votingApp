import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";

export default function HeroSectionMessage() {
  return (
    <>
      <Heading type="h1" className="text-4xl fw-700 mb-1p5r ta-left">
        Welcome to VoteNow
      </Heading>
      <Paragraph className="text-xl mb-2p5r text-grey-dark"> 
        Your secure and reliable online voting platform. Whether you're running
        a student election, hosting a community poll, or conducting an
        organizational vote, VoteNow is built to handle it with ease and
        integrity.
      </Paragraph>
    </>
  );
}
