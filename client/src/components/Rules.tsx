import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";

export function Rules() {
  return (
    <>
      <NavBar />
      <section className="min-h-screen bg-midnight py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-gold max-w-none"
          >
            <h1 className="text-4xl font-bold text-gold mb-8 text-center">How to Play</h1>

            <div className="bg-black/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Objective</h2>
              <ul className="list-disc pl-6 text-white/90">
                <li>Earn 4 Mercy Tokens with 0 Mortal Sins to reach Heaven and win.</li>
                <li>Alternatively, enter Purgatory with 3 Mercy Tokens and 0 Mortal Sins for protection until earning one more Mercy Token.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gold mb-4">Confession</h2>
                <ul className="list-disc pl-6 text-white/90">
                  <li>Roll a die at round end to remove all Mortal Sins (4-6 succeeds).</li>
                  <li>The Pope may excommunicate one player, denying confession.</li>
                </ul>
              </div>

              <div className="bg-black/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gold mb-4">Purgatory Rules</h2>
                <ul className="list-disc pl-6 text-white/90">
                  <li>Enter with 3 Mercy Tokens and 0 Mortal Sins.</li>
                  <li>Cannot receive Mortal Sins while in Purgatory.</li>
                  <li>Need one more Mercy Token to win.</li>
                  <li>Receive a Blessing Card upon entry.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                className="text-gold border-gold hover:bg-gold/10"
                onClick={() => window.scrollTo(0, 0)}
              >
                Back to Top
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}