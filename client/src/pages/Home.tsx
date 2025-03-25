import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <NavBar />
      <Hero />
      <About />
    </main>
  );
}
