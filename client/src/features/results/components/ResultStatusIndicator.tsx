import I from "components/ui/I";
import Span from "components/ui/Span";
import Block from "components/ui/Block";

export interface ResultStatusIndicatorProps {
  textColor: "text-green" | "text-yellow-cool" | "text-red-cool";
  indicatorType: "fa-check-circle" | "fa-handshake" | "fa-times-circle";
  message: "Won the election" | "Tie" | "Lost the election";
}

export default function ResultStatusIndicator({
  textColor,
  indicatorType,
  message,
}: ResultStatusIndicatorProps) {
  return (
    <Block className={textColor}>
      <Span className="fw-bold ff-nanum mr-5p">{message}</Span>
      <I className={`far ${indicatorType} fa-lg`} />
    </Block>
  );
}
