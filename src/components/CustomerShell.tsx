import { useState, useEffect } from "react";
import { useLocation, Outlet, Link } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { 
  Shield, 
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FileImage,
  Package,
  FileText,
  Settings,
  ChevronDown,
  User,
  LogOut,
  Building,
  Users
} from "lucide-react";


interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: number;
}

const CustomerShell = () => {
  const [currentSite, setCurrentSite] = useState("Main Site");
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    checkCustomerStatus();
  }, [user]);

  const checkCustomerStatus = async () => {
    if (!user) return;
    
    try {
      // Check if user has customer or user role (not platform_admin)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking customer status:', error);
        return;
      }
      
      // Allow customers and legacy users, but not platform_admin
      setIsCustomer(profile?.role === 'customer' || profile?.role === 'user');
    } catch (error) {
      console.error('Error checking customer status:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
      badge: 3, // Example badge count
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Evidence",
      url: "/evidence",
      icon: FileImage,
    },
    {
      title: "Audit Pack",
      url: "/audit-pack",
      icon: Package,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  const sites = ["Main Site", "Cafe North", "Cafe South", "Childcare Centre"];

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isCustomer) {
    return null; // Will redirect in parent route guard
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-card border-r">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-lg text-foreground">
                  ComplyEasy
                </span>
              </div>
            </div>

            {/* Site Switcher */}
            <div className="p-4 border-b border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-foreground hover:bg-muted"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>{currentSite}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Select Site</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sites.map((site) => (
                    <DropdownMenuItem 
                      key={site}
                      onClick={() => setCurrentSite(site)}
                      className={currentSite === site ? "bg-accent" : ""}
                    >
                      {site}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground">
                Compliance Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url}
                          className={`flex items-center space-x-3 transition-colors ${
                            isActive(item.url) 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'text-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto bg-accent text-accent-foreground"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
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
          <header className="border-b bg-card h-16 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden" />
                <h1 className="text-xl font-heading font-semibold capitalize">
                  {location.pathname.slice(1) || 'dashboard'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="font-medium">
                          {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">Customer</p>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <User className="w-4 h-4 mr-2" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Preferences
                      </Link>
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
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerShell;