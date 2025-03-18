import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const slides = [
  "url('https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=2000')",
  "url('https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=2000')",
  "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=2000')"
];

const slogans = [
  "What's up Sinners?",
  "Get ready to sin!",
  "Let the sins begin!"
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlogan, setCurrentSlogan] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const sloganInterval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(sloganInterval);
    };
  }, []);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      style={{
        backgroundImage: slides[currentSlide],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold mb-8 accent-[var(--gold)]"
        >
          The Sin Game
        </motion.h1>

        <motion.div
          key={currentSlogan}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-2xl md:text-4xl text-white font-light"
        >
          {slogans[currentSlogan]}
        </motion.div>
      </div>
    </section>
  );
}
