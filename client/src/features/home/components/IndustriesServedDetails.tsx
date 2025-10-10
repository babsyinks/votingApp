import IndustryList from "./IndustryList";
import Section from "components/ui/Section";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";
import useWindowSize from "hooks/useWindowSize";

export default function IndustriesServedDetails() {
  const { width } = useWindowSize();
  const isMidScreen = width >= 768;
  return (
    <Section
      className={`text-white px-1p5r py-3r ${isMidScreen ? "px-4r" : ""} bg-gradient-translucent-blue`}
    >
      <Block className="mxw-72r mx-auto ta-center">
        <Heading type="h2" className={`text-3xl lh-2r ${isMidScreen?"lh-2p5r":""} fw-700 mb-1r`}>Who We Serve</Heading>
        <Paragraph useDefaultStyle={false} className="text-lg lh-2r text-white mxw-48r mx-auto">
          Our voting platform is designed to serve a diverse range of industries and organizations,
          ensuring secure, transparent, and inclusive decision-making processes for groups of all
          sizes.
        </Paragraph>
        <IndustryList />
      </Block>
    </Section>
  );
}
