import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
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
  Menu
} from "lucide-react";

interface User {
  username: string;
  name: string;
  role: string;
  loginTime: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: number;
}

const AppShell = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSite, setCurrentSite] = useState("Main Site");
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="carbon-bg border-r-0">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b border-carbon-foreground/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-lg text-carbon-foreground">
                  ComplyEasy
                </span>
              </div>
            </div>

            {/* Site Switcher */}
            <div className="p-4 border-b border-carbon-foreground/10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between hover:bg-carbon-foreground/10"
                    style={{ color: 'hsl(var(--carbon-foreground))' }}
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
              <SidebarGroupLabel 
                className="text-carbon-foreground/70"
                style={{ color: 'hsl(var(--carbon-foreground) / 0.7)' }}
              >
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
                              : 'text-carbon-foreground hover:bg-carbon-foreground/10 hover:text-carbon-foreground'
                          }`}
                          style={{
                            color: isActive(item.url) ? 'hsl(var(--primary-foreground))' : 'hsl(var(--carbon-foreground))'
                          }}
                        >
                          <item.icon className="w-4 h-4" style={{ color: 'inherit' }} />
                          <span style={{ color: 'inherit' }}>{item.title}</span>
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
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
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