import useWindowSize from "hooks/useWindowSize";
import Section from "components/ui/Section";
import Block from "components/ui/Block";
import HeroSectionMessage from "./HeroSectionMessage";
import HeroSectionLink from "./HeroSectionLink";
import HeroSectionImage from "./HeroSectionImage";

export default function HeroSection({ userIsAuthenticated }) {
  const { width } = useWindowSize();
  const type = width >= 768 ? "flex-horz-sb" : "flex-vert";
  return (
    <Section type={type} className="px-1p5r-py-4r bg-gradient-blueviolet text-white">
      <Block className="flex-1 p-1r fadeInLeft">
        <HeroSectionMessage />
        <HeroSectionLink userIsAuthenticated={userIsAuthenticated} />
      </Block>
      <Block type="flex-horz" className="flex-1 p-1r fadeInLeft">
        <HeroSectionImage />
      </Block>
    </Section>
  );
}
