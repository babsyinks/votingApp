import I from "components/ui/I";
import Span from "components/ui/Span";
import Block from "components/ui/Block";

export default function ResultStatusIndicator({
  textColor,
  indicatorType,
  message,
}) {
  return (
    <Block className={textColor}>
      <Span className="fw-bold ff-nanum mr-5">{message}</Span>
      <I className={`far ${indicatorType} fa-lg`}></I>
    </Block>
  );
}
