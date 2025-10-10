import React from "react";
import testimonials from "../data/testimonials";
import TestimonialCard from "./TestimonialCard";
import Section from "components/ui/Section";
import Heading from "components/ui/Heading";
import Block from "components/ui/Block";

const TestimonialList = () => (
  <Section className="p-2r bg-gradient-translucent-blue">
    <Heading type="h2" className="ta-center text-white">
      What Our Customers Are Saying
    </Heading>
    <Block type="flex" className="flex-wrap gap-1p5r justify-content-center">
      {testimonials.map((t, idx) => (
        <TestimonialCard key={idx} quote={t.quote} author={t.author} />
      ))}
    </Block>
  </Section>
);

export default TestimonialList;
