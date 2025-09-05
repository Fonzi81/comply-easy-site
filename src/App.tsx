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
import UserManagement from "@/pages/UserManagement";
import RoleManagement from "@/pages/RoleManagement";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminSystem from "@/pages/AdminSystem";
import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminTemplates from "@/pages/AdminTemplates";
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
import AdminShell from "./components/AdminShell";
import CustomerShell from "./components/CustomerShell";
import { AdminRoute } from "./components/AdminRoute";
import { CustomerRoute } from "./components/CustomerRoute";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

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
              
              {/* Admin routes - Platform Administration */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
              </Route>
              <Route path="/admin/customers" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<UserManagement />} />
              </Route>
              <Route path="/admin/organizations" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<AdminOrganizations />} />
              </Route>
              <Route path="/admin/templates" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<AdminTemplates />} />
              </Route>
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<AdminAnalytics />} />
              </Route>
              <Route path="/admin/system" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<AdminSystem />} />
              </Route>
              <Route path="/admin/roles" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<RoleManagement />} />
              </Route>
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }>
                <Route index element={<Settings />} />
              </Route>

              {/* Customer routes - Compliance Management */}
              <Route path="/dashboard" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/tasks" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<Tasks />} />
              </Route>
              <Route path="/calendar" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<CalendarView />} />
              </Route>
              <Route path="/evidence" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<Evidence />} />
              </Route>
              <Route path="/audit-pack" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<AuditPack />} />
              </Route>
              <Route path="/templates" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
              }>
                <Route index element={<Templates />} />
              </Route>
              <Route path="/settings" element={
                <CustomerRoute>
                  <CustomerShell />
                </CustomerRoute>
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