import { Link } from "react-router-dom";
import Paragraph from "../../../components/ui/Paragraph";
import Block from "../../../components/ui/Block";
export default function HelpSection() {
  return (
    <Block className="mt-3r ta-center text-base">
      <Paragraph>
        Need assistance?{" "}
        <Link to="/help" className="text-blueviolet-mute fw-600 transition-color td-none">
          Visit our Help Center →
        </Link>
      </Paragraph>
    </Block>
  );
}
