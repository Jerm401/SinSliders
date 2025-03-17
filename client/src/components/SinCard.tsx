import { motion } from "framer-motion";

interface SinCardProps {
  index: number;
  description: string;
}

export function SinCard({ index, description }: SinCardProps) {
  const randomRotation = Math.random() * 30 - 15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: randomRotation }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      className="aspect-[2/3] relative rounded-lg bg-blood p-6 flex items-center justify-center shadow-xl"
    >
      <p className="text-white text-center font-medium">
        {description}
      </p>
    </motion.div>
  );
}