import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar, Upload } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose your state pack",
    description: "Select from QLD, NSW, VIC, or WA compliance templates preloaded with all required schedules and documentation.",
    icon: Download,
    color: "text-primary"
  },
  {
    step: "02", 
    title: "We schedule & remind",
    description: "Automatic calendar integration with email and SMS reminders for all compliance deadlines and review dates.",
    icon: Calendar,
    color: "text-accent"
  },
  {
    step: "03",
    title: "Upload evidence & export",
    description: "Store all compliance evidence in one place, then generate audit-ready packs with a single click.",
    icon: Upload,
    color: "text-primary"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your compliance management from chaos to clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="relative">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center ${step.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-heading">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground/30">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M16 4l12 12-12 12v-8H4v-8h12V4z" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          )}
        </div>

        {/* ROI Preview */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-heading font-bold mb-4">Save time, avoid fines</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-heading font-bold text-primary">20+</div>
              <div className="text-muted-foreground">Hours saved per month</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-accent">$50K+</div>
              <div className="text-muted-foreground">Potential fines avoided</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-primary">10 min</div>
              <div className="text-muted-foreground">Time to first value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;