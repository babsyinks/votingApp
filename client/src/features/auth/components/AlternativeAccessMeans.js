import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import Paragraph from "components/ui/Paragraph";

export default function AlternativeAccessMeans({
  question = "",
  btnLabel,
  route,
}) {
  const navigate = useNavigate();

  return (
    <Paragraph className="text-sm">
      {question} <Button onClick={() => navigate(route)}>{btnLabel}</Button>
    </Paragraph>
  );
}
