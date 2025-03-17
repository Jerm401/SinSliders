import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gold">The Sin Game</h1>
        <div className="flex gap-4">
          <Button 
            variant="ghost"
            className="text-white hover:text-gold"
          >
            How to Play
          </Button>
          <Button 
            className="bg-blood hover:bg-blood/80 text-white"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </nav>
  );
}
