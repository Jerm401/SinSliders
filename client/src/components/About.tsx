import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
            What's up sinners! Welcome to The Sin Game, where your darkest secrets
            and guilty pleasures come to play. Get ready to reveal, confess, and
            maybe even absolve yourself in this wickedly fun party game!
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button 
              variant="outline" 
              className="text-gold border-gold hover:bg-gold/10"
            >
              Game Rules
            </Button>
            <Button 
              variant="outline"
              className="text-gold border-gold hover:bg-gold/10"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}