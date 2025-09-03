import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold text-primary">
              ComplyEasy
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link to="/product/overview">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Overview</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Complete compliance management platform
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/product/food-safety-3-2-2a">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Food Safety 3.2.2A</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Training & temperature logs, staff records
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/product/whs">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">WHS</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Incidents, hazards & risk templates
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/product/fire-safety">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Fire Safety</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Extinguisher service & evacuation plans
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/product/test-and-tag">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Test & Tag</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          AS/NZS 3760 intervals preloaded
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <Link to="/templates/state-packs">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">All State Packs</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Choose your state-specific pack
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    {[
                      { code: "QLD", path: "/templates/qld" },
                      { code: "NSW", path: "/templates/nsw" },
                      { code: "VIC", path: "/templates/vic" },
                      { code: "WA", path: "/templates/wa" }
                    ].map((state) => (
                      <Link key={state.code} to={state.path}>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{state.code} Pack</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            State-specific compliance templates
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pricing">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <Link to="/resources">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Resources</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Guides, templates & tools
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/calendar">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Compliance Calendar</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          2025 state-specific calendars
                        </p>
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/partners">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Partners</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Integration partners & support
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/login">
              <Button>Start free trial</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium">Product</div>
                <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                  <Link to="/product/overview">Overview</Link>
                  <Link to="/product/food-safety-3-2-2a">Food Safety 3.2.2A</Link>
                  <Link to="/product/whs">WHS</Link>
                  <Link to="/product/fire-safety">Fire Safety</Link>
                  <Link to="/product/test-and-tag">Test & Tag</Link>
                </div>
              </div>
              <Link to="/pricing">Pricing</Link>
              <Link to="/resources">Resources</Link>
              <div className="pt-4 border-t space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button className="w-full">Start free trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;