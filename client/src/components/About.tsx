import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardGrid } from "./CardGrid";

export function About() {
  return (
    <section className="min-h-screen bg-midnight py-20 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-20 text-center"
        >
          <h2 className="text-4xl font-bold text-gold mb-6">
            About The Game
          </h2>
          <p className="text-lg text-white/90">
            Welcome to The Sin Game, a Catholic themed party game of moral judgment, strategic 
            deception, and divine intervention. Players take on the role of 
            sinners navigating the perilous path between Heaven and Hell, striving 
            for salvation while avoiding eternal damnation.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button 
              variant="outline" 
              className="text-gold border-gold hover:bg-gold/10"
              onClick={() => window.location.href = '/rules'}
            >
              Game Rules
            </Button>
            <Button 
              variant="outline"
              className="text-gold border-gold hover:bg-gold/10"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gold mb-8 text-center">
            Preview Some Sin Cards
          </h3>
          <CardGrid />
        </motion.div>
      </div>
    </section>
  );
}