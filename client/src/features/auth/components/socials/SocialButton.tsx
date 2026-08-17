import AuthButton from "../AuthButton";
import I from "components/ui/I";
import Span from "components/ui/Span";
import useWindowSize from "hooks/useWindowSize";

export type SocialProvider = "Google" | "Facebook" | "Github";

export interface SocialButtonProps {
  type: SocialProvider;
}

const icons: Record<SocialProvider, JSX.Element> = {
  Google: <I className="fab fa-google"></I>,
  Facebook: <I className="fab fa-facebook-f"></I>,
  Github: <I className="fab fa-github"></I>,
};

export default function SocialButton({ type }: SocialButtonProps): JSX.Element {
  const socialLogin = (): void => {
    window.location.href = `http://localhost:3001/api/v1/oauth/${type.toLowerCase()}`;
  };

  const { width } = useWindowSize();
  let contentWidth = "w-60p";

  if (width <= 400) {
    contentWidth = "w-70p";
  }

  return (
    <AuthButton
      onClick={socialLogin}
      className={`btn-social ${type.toLowerCase()}`}
    >
      <Span type="flex-horz" className="w-full">
        <Span className="w-10p mr-5p">{icons[type]}</Span>
        <Span className={contentWidth}>{`Continue with ${type}`}</Span>
      </Span>
    </AuthButton>
  );
}
