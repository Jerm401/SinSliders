import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function NavBar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Create an observer to watch for the second section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setPastHero(!entry.isIntersecting);
      });
    }, {
      threshold: 0.1,
      rootMargin: "-64px 0px 0px 0px"
    });

    // Find the hero section element
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        pastHero ? "bg-black shadow-[0_4px_12px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="The Sin Game"
            className={`h-8 transition-all duration-500 ${
              window.location.pathname === "/" && !pastHero 
                ? "opacity-0 -translate-y-4" 
                : "opacity-100 translate-y-0"
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
          <Button 
            className="bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-white"
            onClick={() => window.location.href = '/order'}
          >
            Pre-Order Now
          </Button>
        </div>
      </div>
    </nav>
  );
}