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
      className="card-flip aspect-[2/3] relative"
    >
      <div 
        className="card-front rounded-lg shadow-xl"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?auto=format&fit=crop&w=400')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="card-back rounded-lg bg-blood p-6 flex items-center justify-center">
        <p className="text-white text-center font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
