import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fadeInUp, staggerChildren } from '@/lib/animations';

// Define the discount tiers
const DISCOUNT_TIERS = [
  { limit: 15, percentage: 50, remainingInitial: 15 },
  { limit: 50, percentage: 30, remainingInitial: 50 },
  { limit: Infinity, percentage: 25, remainingInitial: 0 }
];

export function PreOrder() {
  // State to track remaining games at each discount tier
  const [tierRemainingCounts, setTierRemainingCounts] = useState(
    DISCOUNT_TIERS.map(tier => tier.remainingInitial)
  );
  
  // Current active tier (starts at 0, the first tier)
  const [currentTierIndex, setCurrentTierIndex] = useState(0);

  // In a real app, we would fetch this data from the backend
  useEffect(() => {
    // For demo purposes, we'll simulate the countdown of the first tier
    // In a real application, this would be replaced with actual API data
    const interval = setInterval(() => {
      setTierRemainingCounts(prev => {
        // If the current tier is empty, we don't need to update
        if (prev[currentTierIndex] <= 0) {
          clearInterval(interval);
          return prev;
        }
        
        // Update the count for the current tier
        const newCounts = [...prev];
        newCounts[currentTierIndex] = Math.max(0, newCounts[currentTierIndex] - 1);
        
        // If we've exhausted current tier, move to next tier
        if (newCounts[currentTierIndex] === 0 && currentTierIndex < DISCOUNT_TIERS.length - 1) {
          setCurrentTierIndex(currentTierIndex + 1);
        }
        
        return newCounts;
      });
    }, 10000); // Update every 10 seconds for demo
    
    return () => clearInterval(interval);
  }, [currentTierIndex]);

  // Calculate progress percentage for the current tier
  const progressPercentage = () => {
    const currentTier = DISCOUNT_TIERS[currentTierIndex];
    const remaining = tierRemainingCounts[currentTierIndex];
    const total = currentTier.remainingInitial;
    
    if (total === 0) return 100; // For the last tier which has no limit
    return 100 - (remaining / total * 100);
  };

  // Get information about the next tier (if any)
  const getNextTierInfo = () => {
    if (currentTierIndex >= DISCOUNT_TIERS.length - 1) {
      return null; // No next tier
    }
    return DISCOUNT_TIERS[currentTierIndex + 1];
  };

  const nextTier = getNextTierInfo();

  return (
    <section className="bg-[var(--blood)] text-white py-20">
      <motion.div 
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-5xl font-bold text-[var(--gold)] mb-4">
            Pre-Order The Sin Game
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Be among the first to own The Sin Game at exclusive pre-order prices. 
            Early supporters get the best deals!
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="max-w-2xl mx-auto bg-black/20 p-8 rounded-lg border border-[var(--gold)]/30 backdrop-blur-sm mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div>
              <h3 className="text-3xl font-bold text-[var(--gold)]">
                {DISCOUNT_TIERS[currentTierIndex].percentage}% OFF
              </h3>
              <p className="text-lg opacity-80">
                Current Pre-Order Discount
              </p>
            </div>

            <div className="text-right">
              <h4 className="text-2xl font-bold">
                {tierRemainingCounts[currentTierIndex]} {tierRemainingCounts[currentTierIndex] === 1 ? 'Copy' : 'Copies'}
              </h4>
              <p className="text-lg opacity-80">
                Remaining at this price
              </p>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={progressPercentage()} className="h-3 bg-black/30" />
          </div>

          {nextTier && (
            <p className="text-center text-sm opacity-90 mb-2">
              Next tier: <span className="text-[var(--gold)]">{nextTier.percentage}% off</span> for the next {nextTier.limit} copies
            </p>
          )}
          
          {!nextTier && (
            <p className="text-center text-sm opacity-90 mb-2">
              Final pre-order discount: <span className="text-[var(--gold)]">{DISCOUNT_TIERS[currentTierIndex].percentage}% off</span>
            </p>
          )}
        </motion.div>

        <motion.div
          variants={fadeInUp} 
          className="text-center"
        >
          <Button 
            className="bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-black font-bold text-lg px-8 py-6"
            size="lg"
            onClick={() => window.location.href = '/order'}
          >
            Pre-Order Now
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}