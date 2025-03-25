import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Define the discount tiers (for reference only)
const DISCOUNT_TIERS = [
  { limit: 15, percentage: 50 },
  { limit: 50, percentage: 30 },
  { limit: Infinity, percentage: 25 }
];

// Define the response type for our API
interface DiscountTierResponse {
  percentage: number;
  remaining: number;
  nextTier: { percentage: number } | null;
}

export function PreOrder() {
  const { toast } = useToast();
  
  // Fetch current discount tier from API
  const { data: tierInfo, isLoading, error } = useQuery<DiscountTierResponse>({
    queryKey: ['/api/orders/discount-tier'],
    refetchInterval: 30000, // Refresh every 30 seconds to see updates
  });

  // Show error toast if the fetch fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching discount information",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Calculate progress percentage for the current tier
  const progressPercentage = () => {
    if (!tierInfo) return 0;
    
    // Find the current tier's limit based on percentage
    const currentTierData = DISCOUNT_TIERS.find(t => t.percentage === tierInfo.percentage);
    if (!currentTierData) return 0;
    
    const total = currentTierData.limit;
    const remaining = tierInfo.remaining;
    
    if (total === Infinity) return 100; // For the last tier which has no limit
    return 100 - (remaining / total * 100);
  };

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
            Get The Sin Game
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Be among the first to own The Sin Game at exclusive prices. 
            Click below to check out our store!
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="max-w-2xl mx-auto bg-black/20 p-8 rounded-lg border border-[var(--gold)]/30 backdrop-blur-sm mb-10"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg">Loading discount information...</p>
            </div>
          ) : !tierInfo ? (
            <div className="text-center py-8">
              <p className="text-xl">Unable to load discount information</p>
              <p className="mt-2 opacity-80">Please try again later</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--gold)]">
                    {tierInfo.percentage}% OFF
                  </h3>
                  <p className="text-lg opacity-80">
                    Current Discount
                  </p>
                </div>

                <div className="text-right">
                  <h4 className="text-2xl font-bold">
                    Limited Time Offer
                  </h4>
                  <p className="text-lg opacity-80">
                    Don't miss out!
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <Progress value={progressPercentage()} className="h-3 bg-black/30" />
              </div>

              <p className="text-center text-sm opacity-90 mb-2">
                Current discount: <span className="text-[var(--gold)]">{tierInfo.percentage}% off</span>
              </p>
            </>
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
              View Store
            </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}