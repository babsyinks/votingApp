import Block from "components/ui/Block";
import SocialButton, { SocialProvider } from "./SocialButton";

export default function SocialButtons() {
  const socials: SocialProvider[] = ["Google", "Facebook", "Github"];

  return (
    <Block>
      {socials.map((type, i) => (
        <SocialButton type={type} key={i} />
      ))}
    </Block>
  );
}
