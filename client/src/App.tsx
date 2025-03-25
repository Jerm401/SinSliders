import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { Rules } from "@/components/Rules";
import Order from "@/pages/Order"; // Import the new Order component

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rules" component={Rules} />
      <Route path="/order" component={Order} /> {/* Add the Order route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;