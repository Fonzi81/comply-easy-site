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
  Menu,
  UserCog
} from "lucide-react";


interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: number;
}

const AppShell = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      loadOrganizations();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: hasAccess, error } = await supabase
        .rpc('has_permission', { perm: 'admin.portal.access' });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }
      
      setIsAdmin(!!hasAccess);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadOrganizations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          organizations!inner (
            id,
            name,
            industry,
            address
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading organizations:', error);
        return;
      }

      const orgs = data?.map(item => ({
        id: item.organizations.id,
        name: item.organizations.name,
        industry: item.organizations.industry,
        address: item.organizations.address,
        role: item.role
      })) || [];

      setOrganizations(orgs);
      if (orgs.length > 0) {
        setCurrentOrg(orgs[0]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
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

  const adminNavItems: NavItem[] = [
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: UserCog,
    },
    {
      title: "Role Management", 
      url: "/admin/roles",
      icon: Shield,
    },
  ];

  // Remove hardcoded sites - now using real organization data

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return <div>Loading...</div>;
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

            {/* Organization Info */}
            {currentOrg && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{currentOrg.name}</p>
                    <p className="text-xs text-muted-foreground">{currentOrg.industry}</p>
                  </div>
                </div>
                {currentOrg.address && (
                  <p className="text-xs text-muted-foreground mt-2 pl-7">
                    {currentOrg.address}
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground">
                Navigation
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

            {/* Admin Navigation */}
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-muted-foreground">
                  Administration
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavItems.map((item) => (
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
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
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
                        <p className="text-xs text-muted-foreground">User</p>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
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

export default AppShell;