import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    document.title = "Pricing - ComplyEasy | Simple Compliance Management";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Choose the perfect ComplyEasy plan for your business. Start with a 14-day free trial. Simple per-site pricing with no setup fees or hidden costs.'
      );
    }
  }, []);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 29,
      annualPrice: 24,
      description: "Perfect for single locations getting started with compliance",
      features: [
        { name: "Email reminders", included: true },
        { name: "Audit Pack exports", included: true },
        { name: "2GB storage per site", included: true },
        { name: "Basic state templates", included: true },
        { name: "Email support", included: true },
        { name: "SMS reminders", included: false },
        { name: "Calendar sync", included: false },
        { name: "Webhooks", included: false },
        { name: "Priority support", included: false },
        { name: "Xero integration", included: false },
      ],
      popular: false
    },
    {
      name: "Growth",
      monthlyPrice: 59,
      annualPrice: 49,
      description: "Growing businesses with multiple compliance needs",
      features: [
        { name: "Everything in Starter", included: true },
        { name: "SMS reminders", included: true },
        { name: "Calendar sync (Google/Outlook)", included: true },
        { name: "10GB storage per site", included: true },
        { name: "Webhooks & integrations", included: true },
        { name: "Priority support", included: true },
        { name: "Custom workflows", included: false },
        { name: "Xero integration", included: false },
        { name: "Franchise roll-ups", included: false },
        { name: "Dedicated support", included: false },
      ],
      popular: true
    },
    {
      name: "Pro",
      monthlyPrice: 79,
      annualPrice: 66,
      description: "Franchise and multi-site operations",
      features: [
        { name: "Everything in Growth", included: true },
        { name: "Xero integration", included: true },
        { name: "25GB storage per site", included: true },
        { name: "Franchise roll-ups (beta)", included: true },
        { name: "Custom workflows", included: true },
        { name: "Dedicated support", included: true },
        { name: "API access", included: true },
        { name: "White-label options", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Compliance consultancy", included: true },
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
                Simple, transparent pricing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Start with a 14-day free trial. No setup fees, no hidden costs. 
                Cancel anytime. Perfect for businesses of all sizes.
              </p>
              
              {/* Annual/Monthly Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="scale-125"
                />
                <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Annual
                </span>
                <Badge className="ml-2 bg-accent text-accent-foreground">
                  Save 2 months
                </Badge>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border shadow-md'} hover:shadow-lg transition-all`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-6 py-2">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-heading mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-5xl font-heading font-bold">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground ml-1">/site/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-muted-foreground line-through">
                        Was ${plan.monthlyPrice}/month
                      </div>
                    )}
                    <CardDescription className="text-base mt-4">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Button 
                      className={`w-full py-6 text-lg ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      Start free trial
                    </Button>

                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 mr-3 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enterprise */}
            <div className="text-center mt-16">
              <Card className="max-w-2xl mx-auto border-2 border-dashed border-muted-foreground/30">
                <CardContent className="py-12">
                  <h3 className="text-2xl font-heading font-bold mb-4">Enterprise</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Need custom compliance workflows, advanced integrations, or white-label solutions? 
                    Let's discuss your requirements.
                  </p>
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Pricing FAQ
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    How does per-site pricing work?
                  </h3>
                  <p className="text-muted-foreground">
                    Each physical location (café, office, warehouse, etc.) counts as one site. 
                    You can manage multiple compliance domains (Food, WHS, Fire, Test & Tag) 
                    within each site at no extra cost.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Upgrade or downgrade your plan at any time. Changes take effect 
                    immediately, and we'll prorate any billing differences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    What happens to my data if I cancel?
                  </h3>
                  <p className="text-muted-foreground">
                    You own your compliance data. Export everything before cancelling, 
                    and we'll keep your data available for 90 days after cancellation 
                    in case you want to reactivate.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    Do you offer discounts for multiple sites?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Contact us for volume discounts on 10+ sites. We also offer 
                    special pricing for franchises, associations, and educational institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;