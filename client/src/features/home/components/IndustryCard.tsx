import { motion } from "framer-motion";

export interface IndustryCardProps  {name: string} 

export default function IndustryCard({ name }: IndustryCardProps) {
  return (
    <motion.div
      className="bg-white border-2-aqua bs-black-mixed-mild border-rounded-1r p-1r flex align-items-center justify-content-center ta-center text-black-firm fw-500"
    >
      {name}
    </motion.div>
  );
}
