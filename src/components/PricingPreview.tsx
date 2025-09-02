import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "per site/month",
    description: "Perfect for single locations getting started with compliance",
    features: [
      "Email reminders",
      "Audit Pack exports", 
      "2GB storage",
      "Basic templates",
      "Email support"
    ],
    cta: "Start free trial",
    popular: false
  },
  {
    name: "Growth", 
    price: "$59",
    period: "per site/month",
    description: "Growing businesses with multiple compliance needs",
    features: [
      "Everything in Starter",
      "SMS reminders",
      "Calendar sync (Google/Outlook)",
      "10GB storage", 
      "Webhooks & integrations",
      "Priority support"
    ],
    cta: "Start free trial",
    popular: true
  },
  {
    name: "Pro",
    price: "$79", 
    period: "per site/month",
    description: "Franchise and multi-site operations",
    features: [
      "Everything in Growth",
      "Xero integration",
      "25GB storage",
      "Franchise roll-ups (beta)",
      "Custom workflows",
      "Dedicated support"
    ],
    cta: "Start free trial",
    popular: false
  }
];

const PricingPreview = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No setup fees, no hidden costs. 
            Cancel anytime.
          </p>
          
          {/* Annual savings badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
            💰 Annual plans save 2 months free
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border shadow-md'} hover:shadow-lg transition-all`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-heading font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80">
            View detailed pricing & features
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;