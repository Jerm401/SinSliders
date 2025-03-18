import { useState, useEffect } from "react";
import { SinCard } from "./SinCard";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Total number of sin cards available
const TOTAL_CARDS = 19;
const DISPLAY_CARDS = 5;

export function CardGrid() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>(
    {},
  );

  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleCards = () => {
    // First flip all cards to back
    const allFlipped = Object.fromEntries(
      Array(DISPLAY_CARDS).fill(0).map((_, i) => [i, false])
    );
    setFlippedCards(allFlipped);

    // After cards are flipped, perform shuffle
    setTimeout(() => {
      setIsShuffling(true);
      const allCards = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
      const shuffled = allCards
        .sort(() => Math.random() - 0.5)
        .slice(0, DISPLAY_CARDS);
      setSelectedCards(shuffled);
      setTimeout(() => setIsShuffling(false), 500);
    }, 600); // Wait for flip animation to complete
  };

  const handleCardClick = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="w-full mx-auto px-4">
      <AnimatePresence>
        <motion.div
          className="flex overflow-x-scroll scroll-snap-x gap-6 px-6 pb-6 md:flex-wrap md:justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          {selectedCards.map((cardNumber, index) => (
            <motion.div
              key={`${cardNumber}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={`scroll-snap-center ${isShuffling ? 'animate-shake' : ''}`}>
                <SinCard
                  key={`${cardNumber}-${index}`}
                  frontImage={`/sin-card-${cardNumber}.jpg`}
                  isFlipped={flippedCards[index] || false}
                  onClick={() => handleCardClick(index)}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {Object.values(flippedCards).some(Boolean) && (
          <motion.div 
            className="flex justify-center my-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={shuffleCards}
              variant="outline"
              className="text-gold border-gold hover:bg-gold/10 gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Shuffle
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
