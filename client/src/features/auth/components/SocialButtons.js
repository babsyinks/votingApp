import Block from "components/ui/Block";
import SocialButton from "./SocialButton";

export default function SocialButtons() {
  const socials = ["Google", "Facebook", "Github"];
  return (
    <Block className="space-y-2 mt-6">
      {socials.map((type, i) => (
        <SocialButton type={type} key={i} />
      ))}
    </Block>
  );
}
