import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface DiscountTierResponse {
  percentage: number;
  remaining: number;
  nextTier: { percentage: number } | null;
}

export default function Order() {
  const [formData, setFormData] = useState({
    quantity: 1,
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    customerCity: "",
    customerState: "",
    customerZip: "",
    customerCountry: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  // Fetch current discount tier to display
  const { data: tierInfo } = useQuery<DiscountTierResponse>({
    queryKey: ['/api/orders/discount-tier'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value) || 1) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          discountPercentage: tierInfo?.percentage || 0,
          subtotal: parseFloat(pricing.subtotal),
          total: parseFloat(pricing.total)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      setOrderComplete(true);
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your pre-order.",
      });
    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: "Failed to place order",
        description: typeof error === 'object' && error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate pricing based on quantity and current discount
  const calculatePricing = () => {
    const basePrice = 39.99;
    const discountPercentage = tierInfo?.percentage || 0;
    const quantity = formData.quantity;

    const subtotal = basePrice * quantity;
    const discount = subtotal * (discountPercentage / 100);
    const total = subtotal - discount;

    return {
      basePrice,
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      discountPercentage
    };
  };

  const pricing = calculatePricing();

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-midnight">
        <NavBar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
              <p className="mb-6">Thank you for pre-ordering The Sin Game.</p>
              <p className="mb-4">We've sent a confirmation email to {formData.customerEmail}.</p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight">
      <NavBar />
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-6">Pre-Order The Sin Game</h1>

            {tierInfo && (
              <div className="mb-4 p-3 bg-black/20 rounded-md border border-[var(--gold)]/30">
                <p className="font-bold text-[var(--gold)]">Current Discount: {tierInfo.percentage}% OFF</p>
                <p className="text-sm opacity-80">Only {tierInfo.remaining} orders left at this discount tier!</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input
                      type="text"
                      name="customerCity"
                      value={formData.customerCity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State/Province
                    </label>
                    <Input
                      type="text"
                      name="customerState"
                      value={formData.customerState}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      name="customerZip"
                      value={formData.customerZip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <Input
                      type="text"
                      name="customerCountry"
                      value={formData.customerCountry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 border border-gray-200 rounded-md bg-black/20">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>${pricing.basePrice} x {formData.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[var(--gold)]">
                      <span>Discount ({pricing.discountPercentage}%):</span>
                      <span>-${pricing.discount}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
                      <span>Total:</span>
                      <span>${pricing.total}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Place Pre-Order"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}