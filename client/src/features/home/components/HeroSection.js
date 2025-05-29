import Section from "../../../components/ui/Section";
import Block from "../../../components/ui/Block";
import HeroSectionMessage from "./HeroSectionMessage";
import HeroSectionLink from "./HeroSectionLink";
import HeroSectionImage from "./HeroSectionImage";
import styles from "./HeroSection.module.css";

export default function HeroSection({ userIsAuthenticated }) {
  return (
    <Section className={styles.heroSection}>
      <Block className={styles.heroContent}>
        <HeroSectionMessage />
        <HeroSectionLink userIsAuthenticated={userIsAuthenticated} />
      </Block>
      <Block className={styles.heroImage}>
        <HeroSectionImage />
      </Block>
    </Section>
  );
}
