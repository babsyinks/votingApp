import Block from "components/ui/Block";
import A from "components/ui/A";
import I from "components/ui/I";
import Button from "components/ui/Button";
import type { helpNumsTypes } from "../data/helpNums";

export interface HelpMeansWhatsAppProps {
  phoneNumber: helpNumsTypes[number];
  helpDeskSlot: number;
}

function HelpMeansWhatsApp({
  phoneNumber,
  helpDeskSlot,
}: HelpMeansWhatsAppProps) {
  const animation = helpDeskSlot === 1 ? "slideInLeft" : "slideInRight";
  return (
    <>
      <>
        <Block type="flex-vert" className={animation}>
          <A
            href={`https://api.whatsapp.com/send?phone=${phoneNumber}`}
            target="_blank"
          >
            <Button className="primary-btn-2">
              {`Chat Help Desk ${helpDeskSlot}`}
              <I className="fab fa-whatsapp"></I>
            </Button>
          </A>
        </Block>
      </>
    </>
  );
}

export default HelpMeansWhatsApp;
