import React from "react";
import PropTypes from "prop-types";
import Blockquote from "components/ui/Blockquote";
import Paragraph from "components/ui/Paragraph";
import Footer from "components/ui/Footer";

const TestimonialCard = ({ quote, author }) => (
  <Blockquote className="border-left-6-aqua bg-white mxw-300 p-1r bs-black">
    <Paragraph useDefaultStyle={false} className="fs-italic mb-0p75r">
      “{quote}”
    </Paragraph>
    <Footer className="ta-right fw-bold">— {author}</Footer>
  </Blockquote>
);

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default TestimonialCard;
