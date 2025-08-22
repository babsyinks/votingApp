import Section from "components/ui/Section";
import Grid from "layout/Grid";
import MiniFeatureCard from "./MiniFeatureCard";
import Heading from "components/ui/Heading";

export default function MiniFeatureSection({ section }) {
  return (
    <Section className="mx-auto-my-0 px-1p5r-py-2r">
      <Heading type="h2" className="text-3xl fw-700 ta-center mb-3r">
        {section.title}
      </Heading>
      <Grid className="grid-basic ta-center">
        {section.contents.map((item) => (
          <MiniFeatureCard key={item.id} {...item} />
        ))}
      </Grid>
    </Section>
  );
}
