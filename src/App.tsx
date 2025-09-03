import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CalendarView from "./pages/CalendarView";
import Evidence from "./pages/Evidence";
import AuditPack from "./pages/AuditPack";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import ProductOverview from "./pages/ProductOverview";
import FoodSafety from "./pages/FoodSafety";
import WHS from "./pages/WHS";
import FireSafety from "./pages/FireSafety";
import TestTag from "./pages/TestTag";
import StatePacks from "./pages/StatePacks";
import NotFound from "./pages/NotFound";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSetup from "./pages/AdminSetup";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/product/overview" element={<ProductOverview />} />
              <Route path="/product/food-safety-3-2-2a" element={<FoodSafety />} />
              <Route path="/product/whs" element={<WHS />} />
              <Route path="/product/fire-safety" element={<FireSafety />} />
              <Route path="/product/test-and-tag" element={<TestTag />} />
              <Route path="/templates/state-packs" element={<StatePacks />} />
              
              {/* Protected app routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<Tasks />} />
              </Route>
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<CalendarView />} />
              </Route>
              <Route path="/evidence" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<Evidence />} />
              </Route>
              <Route path="/audit-pack" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<AuditPack />} />
              </Route>
              <Route path="/templates" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<Templates />} />
              </Route>
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;