import useBreakpoint from "hooks/useBreakpoint";
import Block from "components/ui/Block";
import HelpMeansWhatsApp from "./HelpMeansWhatsApp";
import HelpMeansEmail from "./HelpMeansEmail";
import helpNums from "../data/helpNums";
import { BlockProps } from "components/ui/Block";

function HelpMeans() {
  const breakpoint = useBreakpoint();
  let blockType: BlockProps["type"] = "flex-vert";
  if (breakpoint !== "mobile") blockType = "flex-horz-sa";
  return (
    <>
      <Block type={blockType} className="gap-1p5r mb-1p5r">
        {helpNums.map((phoneNumber, i) => (
          <HelpMeansWhatsApp phoneNumber={phoneNumber} helpDeskSlot={i + 1} key={i} />
        ))}
      </Block>
      <HelpMeansEmail />
    </>
  );
}

export default HelpMeans;
