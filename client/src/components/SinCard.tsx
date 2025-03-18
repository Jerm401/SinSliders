import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface SinCardProps {
  frontImage: string;
  onClick?: () => void;
  isFlipped: boolean;
}

export function SinCard({ frontImage, onClick, isFlipped }: SinCardProps) {
  return (
    <div 
      className="relative w-[240px] h-[336px] perspective-1000 cursor-pointer transform transition-transform duration-300 hover:scale-110" 
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden">
          <img 
            src="/sin-card-back.png" 
            alt="Card Back" 
            className="w-full h-full object-cover rounded-lg"
          />
        </Card>

        {/* Front of card */}
        <Card 
          className="absolute w-full h-full backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <img 
            src={frontImage} 
            alt="Sin Card" 
            className="w-full h-full object-cover rounded-lg"
          />
        </Card>
      </motion.div>
    </div>
  );
}