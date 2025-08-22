import Block from "components/ui/Block";
import SocialButton from "./SocialButton";

export default function SocialButtons() {
  const socials = ["Google", "Facebook", "Github"];
  return (
    <Block>
      {socials.map((type, i) => (
        <SocialButton type={type} key={i} />
      ))}
    </Block>
  );
}
