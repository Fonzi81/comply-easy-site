import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-carbon text-carbon-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-heading font-bold text-primary mb-4">
              ComplyEasy
            </div>
            <p className="text-carbon-foreground/80 mb-6 max-w-md">
              Compliance made simple for small business. Preloaded templates, 
              smart reminders, and audit-ready documentation for Food Safety, WHS, 
              Fire Safety, and Test & Tag.
            </p>
            <div className="text-sm text-carbon-foreground/60">
              © 2025 ComplyEasy. All rights reserved.
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/product/overview" className="text-carbon-foreground/80 hover:text-primary transition-colors">Overview</a></li>
              <li><a href="/product/food-safety-3-2-2a" className="text-carbon-foreground/80 hover:text-primary transition-colors">Food Safety 3.2.2A</a></li>
              <li><a href="/product/whs" className="text-carbon-foreground/80 hover:text-primary transition-colors">WHS</a></li>
              <li><a href="/product/fire-safety" className="text-carbon-foreground/80 hover:text-primary transition-colors">Fire Safety</a></li>
              <li><a href="/product/test-and-tag" className="text-carbon-foreground/80 hover:text-primary transition-colors">Test & Tag</a></li>
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Templates</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/templates/qld" className="text-carbon-foreground/80 hover:text-primary transition-colors">Queensland (QLD)</a></li>
              <li><a href="/templates/nsw" className="text-carbon-foreground/80 hover:text-primary transition-colors">New South Wales (NSW)</a></li>
              <li><a href="/templates/vic" className="text-carbon-foreground/80 hover:text-primary transition-colors">Victoria (VIC)</a></li>
              <li><a href="/templates/wa" className="text-carbon-foreground/80 hover:text-primary transition-colors">Western Australia (WA)</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/resources" className="text-carbon-foreground/80 hover:text-primary transition-colors">Resources</a></li>
              <li><a href="/partners" className="text-carbon-foreground/80 hover:text-primary transition-colors">Partners</a></li>
              <li><a href="/security" className="text-carbon-foreground/80 hover:text-primary transition-colors">Security</a></li>
              <li><a href="/pricing" className="text-carbon-foreground/80 hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-carbon-foreground/20" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="/privacy" className="text-carbon-foreground/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-carbon-foreground/60 hover:text-primary transition-colors">Terms of Service</a>
            <a href="/dpa" className="text-carbon-foreground/60 hover:text-primary transition-colors">Data Processing Agreement</a>
            <a href="/status" className="text-carbon-foreground/60 hover:text-primary transition-colors">System Status</a>
          </div>

          <div className="text-sm text-carbon-foreground/60">
            <a href="mailto:support@complyeasy.com.au" className="hover:text-primary transition-colors">
              support@complyeasy.com.au
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;