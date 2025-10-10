import Blockquote from "components/ui/Blockquote";
import Paragraph from "components/ui/Paragraph";
import Footer from "components/ui/Footer";

export interface TestimonialCardProps {
  quote: string;  
  author: string;
}

const TestimonialCard = ({ quote, author }: TestimonialCardProps) => (
  <Blockquote className="border-left-6-aqua bg-white mxw-300 p-1r bs-black">
    <Paragraph useDefaultStyle={false} className="fs-italic mb-0p75r">
      “{quote}”
    </Paragraph>
    <Footer className="ta-right fw-bold">— {author}</Footer>
  </Blockquote>
);

export default TestimonialCard;
