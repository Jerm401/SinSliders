import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardGrid } from "./CardGrid";

export function About() {
  return (
    <section className="min-h-screen bg-midnight py-20">
      <div className="">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-20 text-center"
        >
          <h2 className="text-5xl font-bold text-gold mb-7">
            About The Game
          </h2>
          <p className="text-1xl text-white/90 mt-2">
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
          className="overflow-visible"
        >
          <CardGrid />
        </motion.div>
      </div>
    </section>
  );
}