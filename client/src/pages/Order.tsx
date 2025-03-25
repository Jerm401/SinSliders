import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Order() {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your pre-order.",
      });
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-midnight">
      <NavBar />
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-6">Pre-Order The Sin Game</h1>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Place Pre-Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
