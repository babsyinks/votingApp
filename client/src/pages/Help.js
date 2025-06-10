import React from "react";
import MultiLayerWrapper from "layout/MultiLayerWrapper";
import HelpMessage from "features/help/components/HelpMessage";
import HelpMeans from "features/help/components/HelpMeans";
import HelpFootNote from "features/help/components/HelpFootNote";

function Help() {
  return (
    <MultiLayerWrapper>
      <HelpMessage />
      <HelpMeans />
      <HelpFootNote />
    </MultiLayerWrapper>
  );
}

export default Help;
