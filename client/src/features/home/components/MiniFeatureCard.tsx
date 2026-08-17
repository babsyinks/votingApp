import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Paragraph from "components/ui/Paragraph";
import { motion } from "framer-motion";

import { ContentItem } from "../data/featureCardConfig";

export type MiniFeatureCardProps = Omit<ContentItem, "id">;

export default function MiniFeatureCard({
  icon: Icon,
  title,
  description,
}: MiniFeatureCardProps) {
  return (
    <motion.div
      className="p-2r bg-white transition-bg transition-color bs-black-mixed-mild border-rounded-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <Block className="flex items-center mb-1r">
        <Icon
          className="fw-500 text-white bg-blueviolet-mute p-20p border-rounded-10 mb-3"
          size={90}
        />
        <Heading type="h3" className="text-xl-r fw-600">
          {title}
        </Heading>
      </Block>
      <Paragraph useDefaultStyle={false} className="text-grey-soft lh-1p6">
        {description}
      </Paragraph>
    </motion.div>
  );
}
