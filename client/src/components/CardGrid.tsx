import { useState, useEffect } from "react";
import { SinCard } from "./SinCard";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

// Total number of sin cards available
const TOTAL_CARDS = 19;
const DISPLAY_CARDS = 5;

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
    <div className="w-full mx-auto px-4">
    
      <div className="flex flex-wrap gap-6 justify-center px-6">
        {selectedCards.map((cardNumber, index) => (
          <SinCard
            key={`${cardNumber}-${index}`}
            frontImage={`/sin-card-${cardNumber}.jpg`}
            isFlipped={flippedCards[index] || false}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      
      <div className="flex justify-center mb-6">
        <Button 
          onClick={shuffleCards}
          variant="outline"
          className="text-gold border-gold hover:bg-gold/10 gap-2"
        >
          <Shuffle className="w-5 h-5" />
          Shuffle Cards
        </Button>
      </div>
    </div>
  );
}
