import { useState, useEffect } from "react";
import { SinCard } from "./SinCard";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

// Total number of sin cards available
const TOTAL_CARDS = 19;
const DISPLAY_CARDS = 4;

export function CardGrid() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  const shuffleCards = () => {
    const allCards = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
    const shuffled = allCards.sort(() => Math.random() - 0.5).slice(0, DISPLAY_CARDS);
    setSelectedCards(shuffled);
    setFlippedCards({});
  };

  const handleCardClick = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <Button 
          onClick={shuffleCards}
          variant="outline"
          className="text-gold border-gold hover:bg-gold/10 gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle Cards
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {selectedCards.map((cardNumber, index) => (
          <SinCard
            key={`${cardNumber}-${index}`}
            frontImage={`/sin-card-${cardNumber}.jpg`}
            isFlipped={flippedCards[index] || false}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
