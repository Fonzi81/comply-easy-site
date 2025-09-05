import { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Shield, 
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  ChevronDown,
  User,
  LogOut,
  BarChart3,
  Database,
  UserCog,
  Package
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  description: string;
}

const AdminShellContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { open: sidebarOpen } = useSidebar();

  const adminNavItems: NavItem[] = [
    {
      title: "Platform Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      description: "Revenue, analytics & platform metrics"
    },
    {
      title: "Customer Management",
      url: "/admin/customers",
      icon: Users,
      description: "Manage customer accounts & subscriptions"
    },
    {
      title: "Organizations",
      url: "/admin/organizations",
      icon: Building2,
      description: "Customer organizations & usage"
    },
    {
      title: "Template Management",
      url: "/admin/templates",
      icon: FileText,
      description: "Compliance templates & content"
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      description: "Platform analytics & insights"
    },
    {
      title: "System Health",
      url: "/admin/system",
      icon: Database,
      description: "System monitoring & health"
    },
    {
      title: "Role Management",
      url: "/admin/roles",
      icon: UserCog,
      description: "Permissions & access control"
    },
    {
      title: "Platform Settings",
      url: "/admin/settings",
      icon: Settings,
      description: "Platform configuration"
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const navItem = adminNavItems.find(item => item.url === currentPath);
    return navItem?.title || 'Platform Administration';
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <Sidebar className="bg-white border-r border-slate-200 shadow-sm" collapsible="icon">
        <SidebarContent>
          {/* Logo & Platform Branding */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-heading font-bold text-lg text-slate-900">
                    ComplyEasy
                  </span>
                  <div className="text-xs text-slate-500 font-medium">
                    Platform Admin
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-600 font-semibold">
              Platform Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          `flex items-center gap-3 ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        {sidebarOpen && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {item.description}
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-heading font-semibold text-slate-900">
                  {getPageTitle()}
                </h1>
                <div className="text-sm text-slate-500">
                  Platform administration and management
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Platform Status Badge */}
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Platform Online
              </Badge>

              {/* Admin Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-slate-900">
                        {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500">Platform Admin</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Platform Administrator</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Platform Settings
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/system">
                      <Database className="w-4 h-4 mr-2" />
                      System Health
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminShell = () => {
  return (
    <SidebarProvider>
      <AdminShellContent />
    </SidebarProvider>
  );
};

export default AdminShell;