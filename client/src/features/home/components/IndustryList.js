import IndustryCard from "./IndustryCard";
import industriesServed from "../config/industriesServed";
import Grid from "layout/Grid";

export default function IndustryList() {
  return (
    <Grid useDefaultStyle={false} className="grid-min-1-max-3 gap-1p5r mt-2r">
      {industriesServed.map((industry, idx) => (
        <IndustryCard key={idx} name={industry} />
      ))}
    </Grid>
  );
}
