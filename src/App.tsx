import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductOverview from "./pages/ProductOverview";
import FoodSafety from "./pages/FoodSafety";
import WHS from "./pages/WHS";
import FireSafety from "./pages/FireSafety";
import TestTag from "./pages/TestTag";
import StatePacks from "./pages/StatePacks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product/overview" element={<ProductOverview />} />
          <Route path="/product/food-safety-3-2-2a" element={<FoodSafety />} />
          <Route path="/product/whs" element={<WHS />} />
          <Route path="/product/fire-safety" element={<FireSafety />} />
          <Route path="/product/test-and-tag" element={<TestTag />} />
          <Route path="/templates/state-packs" element={<StatePacks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
