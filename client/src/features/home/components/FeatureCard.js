import Block from "../../../components/ui/Block";
import Heading from "../../../components/ui/Heading";
import List from "../../../components/ui/List";
export default function FeatureCard({ title, items }) {
  return (
    <Block className="bg-white p-1p5r border-rounded-1r bs-black">
      <Heading type="h2" className="text-2xl fw-600 mb-1r">
        {title}
      </Heading>
      <List className="pl-1p25r text-grey-dark lh-1p6" items={items} />
    </Block>
  );
}
