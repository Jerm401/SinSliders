
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export function NavBar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > heroHeight * 0.3);
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
        <h1 className={`text-2xl font-bold text-gold transition-opacity duration-300 ${
          pastHero ? "opacity-100" : "opacity-0"
        }`}>
          The Sin Game
        </h1>
        <div className="flex gap-4">
          {!isHomePage && (
            <Button
              variant="ghost"
              className="text-white hover:text-gold"
              onClick={() => window.location.href = '/'}
            >
              <Home className="size-4" />
              Home
            </Button>
          )}
          <Button 
            variant="ghost"
            className="text-white hover:text-gold"
            onClick={() => window.location.href = '/rules'}
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
