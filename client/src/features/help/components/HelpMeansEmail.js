import Paragraph from "components/ui/Paragraph";
import A from "components/ui/A";

function HelpMeansEmail() {
  return (
      <Paragraph>
        Alternatively, you can send an email to:{" "}
        <A href="mailto:multac@proton.me" className="text-base">
          multac@proton.me
        </A>
      </Paragraph>
  );
}

export default HelpMeansEmail;
