import { motion } from "framer-motion";

export default function IndustryCard({ name }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white border-2-aqua bs-black-mixed-mild border-rounded-1r p-1r flex align-items-center justify-content-center ta-center text-black-firm fw-500"
    >
      {name}
    </motion.div>
  );
}
