import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      const heroHeight = heroSection?.clientHeight || 0;

      // Update pastHero when we've scrolled past the hero section
      setPastHero(scrollPosition >= heroHeight);
      // Keep scrolled state for potential future use
      setScrolled(scrollPosition > 50);
    };

    // Run on mount and scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        pastHero ? "bg-black/95 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="The Sin Game"
            className={`h-8 transition-opacity duration-300 ${
              pastHero ? "opacity-100" : "opacity-0"
            }`}
          />
        </a>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-white hover:text-gold"
            onClick={() => (window.location.href = "/rules")}
          >
            How to Play
          </Button>
          <Button className="bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-white">
            Buy Now
          </Button>
        </div>
      </div>
    </nav>
  );
}