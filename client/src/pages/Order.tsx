import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";

export default function Order() {
  return (
    <main className="min-h-screen bg-midnight">
      <NavBar />
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6 text-center">
            <h1 className="text-3xl font-bold mb-6">Coming Soon</h1>
            <p className="text-lg mb-8">
              The Shopify Buy Button will be placed here soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}