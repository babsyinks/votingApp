import { motion } from "framer-motion";
import Block from "components/ui/Block";
import Paragraph from "components/ui/Paragraph";
import Heading from "components/ui/Heading";

export default function MiniFeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      className="p-2r bg-white transition-bg transition-color bs-black-mixed-mild border-rounded-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, }}
    >
      <Block className="flex items-center mb-1r">
        <Icon className="fw-500 text-white bg-blueviolet-mute p-20 border-rounded-10" size={90} />
        <Heading type="h3" className="text-xl fw-600">
          {title}
        </Heading>
      </Block>
      <Paragraph useDefaultStyle={false} className="text-grey-soft lh-1p6">{description}</Paragraph>
    </motion.div>
  );
}
