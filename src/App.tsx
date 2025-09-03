import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import StatePackQLD from "./pages/StatePackQLD";
import StatePackNSW from "./pages/StatePackNSW";
import StatePackVIC from "./pages/StatePackVIC";
import StatePackWA from "./pages/StatePackWA";
import Resources from "./pages/Resources";
import Partners from "./pages/Partners";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import AppShell from "./components/AppShell";
import AdminSetup from "./pages/AdminSetup";
import { AuthProvider } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
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
              <Route path="/templates/qld" element={<StatePackQLD />} />
              <Route path="/templates/nsw" element={<StatePackNSW />} />
              <Route path="/templates/vic" element={<StatePackVIC />} />
              <Route path="/templates/wa" element={<StatePackWA />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/security" element={<Security />} />
              
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;