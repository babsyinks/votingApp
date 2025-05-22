import React from "react";
import Block from "../../../components/ui/Block";
import Heading from "../../../components/ui/Heading";
import defaultStyle from "./ElectivePositionDetailsSummaryPart.module.css";

const ElectivePositionDetailsSummaryPart = ({ label, value }) => {
  const headingType = label === "Position" ? "h2" : "h3";
  return (
    <Block className={defaultStyle["election-position-summary-part-wrapper"]}>
      <Heading
        className={defaultStyle["election-position-summary-part-heading"]}
        type={headingType}
      >
        {label}:{" "}
        <span className={defaultStyle["election-position-summary-part-value"]}>{value}</span>
      </Heading>
    </Block>
  );
};
export default ElectivePositionDetailsSummaryPart;
