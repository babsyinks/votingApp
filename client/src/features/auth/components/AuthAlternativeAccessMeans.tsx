import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import Paragraph from "components/ui/Paragraph";

export interface AuthAlternativeAccessMeansProps {
  /** Optional question text displayed before the button */
  question?: string;
  /** Label text for the navigation button */
  btnLabel: string;
  /** Route to navigate to when the button is clicked */
  route: string;
}

/**
 * Displays a question and a navigation button to provide an alternative
 * way to access authentication-related pages. An example of a place this
 * is used is in the component handling auth for a user whose password has
 * been forgotten.
 *
 * @param props - Component props
 * @returns A paragraph containing the question and a navigation button
 */
export default function AuthAlternativeAccessMeans({
  question = "",
  btnLabel,
  route,
}: AuthAlternativeAccessMeansProps): JSX.Element {
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
