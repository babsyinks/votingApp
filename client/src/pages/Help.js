import React from "react";
import Block from "../components/ui/Block";
import HelpMessage from "../features/help/components/HelpMessage";
import HelpMeans from "../features/help/components/HelpMeans";
import HelpFootNote from "../features/help/components/HelpFootNote";

function Help() {
  return (
    <Block type="flex-horz" className="mnh-100vh p-2r b-l-g-blue">
      <Block className="bg-white-transparent border-rounded-16 p-2r mxw-600 w-full ta-center bs-black fadeIn">
        <HelpMessage />
        <HelpMeans />
        <HelpFootNote />
      </Block>
    </Block>
  );
}

export default Help;
