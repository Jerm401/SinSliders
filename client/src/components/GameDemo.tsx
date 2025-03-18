import { useState, useCallback } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GameCard } from "./GameCard";
import { Card, GameStage, GameState, gameStageLabels } from "@shared/schema";
import { GripHorizontal } from "lucide-react";

const INITIAL_CARDS: Card[] = [
  {
    id: "1",
    frontImage: "/attached_assets/sin-card-1.jpg",
    title: "Pride",
    description: "Pride comes before the fall",
    isRevealed: false,
  },
  {
    id: "2",
    frontImage: "/attached_assets/sin-card-2.jpg",
    title: "Greed",
    description: "The love of money is the root of all evil",
    isRevealed: false,
  },
  {
    id: "3",
    frontImage: "/attached_assets/sin-card-3.jpg",
    title: "Lust",
    description: "Lustful desires lead to destruction",
    isRevealed: false,
  },
  {
    id: "4",
    frontImage: "/attached_assets/sin-card-4.jpg",
    title: "Envy",
    description: "Envy rots the bones",
    isRevealed: false,
  },
  {
    id: "5",
    frontImage: "/attached_assets/sin-card-5.jpg",
    title: "Wrath",
    description: "Anger leads to hate",
    isRevealed: false,
  },
];

function SortableCard(props: Card & { index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <GameCard
        {...props}
        dragHandle={
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <GripHorizontal className="w-4 h-4 text-white/50" />
          </div>
        }
      />
    </div>
  );
}

export function GameDemo() {
  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.INITIAL,
    cards: INITIAL_CARDS,
    canShuffle: true,
    canProceed: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(({ active, over }) => {
    if (over && active.id !== over.id) {
      setGameState((state) => {
        const oldIndex = state.cards.findIndex((card) => card.id === active.id);
        const newIndex = state.cards.findIndex((card) => card.id === over.id);

        return {
          ...state,
          cards: arrayMove(state.cards, oldIndex, newIndex),
        };
      });
    }
  }, []);

  const handleCardClick = useCallback((cardId: string) => {
    if (gameState.stage !== GameStage.CARDS_REVEALED) return;

    setGameState((state) => ({
      ...state,
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, isRevealed: !card.isRevealed } : card
      ),
    }));
  }, [gameState.stage]);

  const handleShuffle = useCallback(() => {
    setGameState((state) => ({
      ...state,
      cards: [...state.cards].sort(() => Math.random() - 0.5),
    }));
  }, []);

  const handleNextStage = useCallback(() => {
    setGameState((state) => {
      const newStage = (() => {
        switch (state.stage) {
          case GameStage.INITIAL:
            return GameStage.CARDS_IN_ROW;
          case GameStage.CARDS_IN_ROW:
            return GameStage.CARDS_REVEALED;
          case GameStage.CARDS_REVEALED:
            return GameStage.TOKEN_AWARDS;
          case GameStage.TOKEN_AWARDS:
            return GameStage.BLESSING_CURSE;
          default:
            return GameStage.INITIAL;
        }
      })();

      let newCards = [...state.cards];
      
      if (newStage === GameStage.TOKEN_AWARDS) {
        newCards = newCards.map((card, index) => ({
          ...card,
          hasMercyToken: index < 2,
          hasMortalSinToken: index > 2,
        }));
      }

      if (newStage === GameStage.BLESSING_CURSE) {
        newCards = newCards.map((card, index) => ({
          ...card,
          hasBlessing: index === 0,
          hasCurse: index === newCards.length - 1,
        }));
      }

      return {
        ...state,
        stage: newStage,
        cards: newCards,
        canShuffle: newStage === GameStage.INITIAL,
      };
    });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gold mb-2">
          {gameStageLabels[gameState.stage]}
        </h3>
        <div className="flex gap-4 justify-center">
          {gameState.canShuffle && (
            <Button onClick={handleShuffle} variant="outline">
              Shuffle Cards
            </Button>
          )}
          <Button onClick={handleNextStage}>
            {gameState.stage === GameStage.BLESSING_CURSE ? "Next Round" : "Next Stage"}
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={gameState.cards}
          strategy={horizontalListSortingStrategy}
        >
          <motion.div 
            className="flex justify-center gap-4"
            layout
          >
            {gameState.cards.map((card, index) => (
              <div key={card.id} onClick={() => handleCardClick(card.id)}>
                <SortableCard {...card} index={index} />
              </div>
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
