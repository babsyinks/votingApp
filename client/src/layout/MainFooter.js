import React from "react";
import Footer from "components/ui/Footer";

/**
 * The main footer component for displaying site-wide footer content.
 *
 * @returns {JSX.Element} The rendered <footer> element with copyright.
 */
export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <Footer className="ta-center px-1p5r-py-2r text-base text-white bg-gradient-translucent-blue">
      © {year} Corestack Technologies
    </Footer>
  );
}
