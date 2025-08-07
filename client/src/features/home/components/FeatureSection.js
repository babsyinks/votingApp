import Grid from "layout/Grid";
import Section from "components/ui/Section";
import FeatureCard from "./FeatureCard";
import featureCardConfig from "../config/featureCardConfig";
export default function FeatureSection() {
  const { item1, item2 } = featureCardConfig;
  return (
    <Section className="mxw-960 mx-auto py-4r-px-1p5r ta-center">
      <Grid className="grid-basic ta-left">
        <FeatureCard title={item1.title} items={item1.contents} />
        <FeatureCard title={item2.title} items={item2.contents} />
      </Grid>
    </Section>
  );
}
