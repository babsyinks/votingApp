import React from "react";
import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";

function HelpMessage() {
  return (
    <>
      <Heading type="h1" className="text-blueviolet-dark text-3xl-r mb-1r">
        Do You Need Help?
      </Heading>
      <Paragraph className="mb-2r text-base-r text-black-cool">
        We're here to help! Reach out to our support team via WhatsApp
      </Paragraph>
    </>
  );
}

export default HelpMessage;
