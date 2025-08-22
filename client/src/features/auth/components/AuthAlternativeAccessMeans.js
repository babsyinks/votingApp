import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import Paragraph from "components/ui/Paragraph";

export default function AuthAlternativeAccessMeans({
  question = "",
  btnLabel,
  route,
}) {
  const navigate = useNavigate();

  return (
    <Paragraph className="text-sm ta-center">
      {question}{" "}
      <Button
        className="text-blueviolet-mute td-none-with-hover fw-500 bg-transparent"
        onClick={() => navigate(route)}
      >
        {btnLabel}
      </Button>
    </Paragraph>
  );
}
