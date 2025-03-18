import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Card as CardType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface GameCardProps extends CardType {
  index: number;
  dragHandle?: React.ReactNode;
}

export function GameCard({ 
  id, 
  frontImage, 
  title,
  isRevealed,
  hasMercyToken,
  hasMortalSinToken,
  hasBlessing,
  hasCurse,
  index,
  dragHandle
}: GameCardProps) {
  return (
    <motion.div
      className="relative w-48 aspect-[2/3]"
      whileHover={{ scale: 1.05 }}
      layout
      layoutId={id}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card 
        className={cn(
          "w-full h-full rounded-lg overflow-hidden cursor-pointer perspective-1000",
          "transition-transform duration-500 transform-style-3d",
          isRevealed && "rotate-y-180"
        )}
      >
        {/* Front of card */}
        <motion.div 
          className={cn(
            "absolute inset-0 bg-black rounded-lg backface-hidden",
            isRevealed && "invisible"
          )}
        >
          <img
            src="/sin-card-back.png"
            alt="Card Back"
            className="w-full h-full object-cover"
          />
          {dragHandle}
        </motion.div>

        {/* Back of card */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-lg backface-hidden rotate-y-180",
            !isRevealed && "invisible"
          )}
        >
          <img
            src={frontImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {hasMercyToken && (
              <div className="w-6 h-6 rounded-full bg-blue-500" title="Mercy Token" />
            )}
            {hasMortalSinToken && (
              <div className="w-6 h-6 rounded-full bg-red-500" title="Mortal Sin Token" />
            )}
          </div>
          <div className="absolute bottom-2 right-2 flex gap-1">
            {hasBlessing && (
              <div className="w-6 h-6 rounded-full bg-yellow-500" title="Blessing" />
            )}
            {hasCurse && (
              <div className="w-6 h-6 rounded-full bg-purple-500" title="Curse" />
            )}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
