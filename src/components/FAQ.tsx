import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "Start using ComplyEasy immediately with full access to all features. No credit card required. Add your sites, explore templates, and set up your first compliance schedules. You can upgrade to a paid plan anytime during or after the trial."
  },
  {
    question: "What's included in state-specific templates?",
    answer: "Each state pack includes pre-configured compliance schedules, document templates, and reminder frequencies based on local regulations. For example, QLD packs include Food Safety Program templates, WHS consultation requirements, and fire safety inspection intervals specific to Queensland legislation."
  },
  {
    question: "Can I manage multiple sites?",
    answer: "Yes! Each site gets its own compliance schedule and evidence vault. You can view all sites from a single dashboard, generate individual or consolidated audit packs, and set different notification preferences for each location."
  },
  {
    question: "How secure is my compliance data?",
    answer: "All data is encrypted at rest and in transit using AES-256 encryption. We maintain audit logs for every document access and export. Your data stays in Australia with enterprise-grade security including SOC2 compliance and regular third-party security audits."
  },
  {
    question: "What happens if I miss a compliance deadline?",
    answer: "ComplyEasy sends multiple reminders via email and SMS (Growth+ plans) before any deadline. If something is overdue, you'll see red alerts in your dashboard and receive escalated notifications. You can also set up backup contacts to ensure nothing falls through the cracks."
  },
  {
    question: "Can I export my data if I need to switch systems?", 
    answer: "Absolutely. You own your compliance data and can export everything at any time. We provide CSV exports for schedules and evidence lists, plus individual file downloads. We also offer migration assistance to help transfer your data to other systems if needed."
  },
  {
    question: "Do you integrate with accounting software?",
    answer: "Yes! Pro plans include Xero integration to sync supplier invoices and service records. We're adding MYOB and QuickBooks integrations in 2025. Contact us if you need a specific integration for your accounting or business management software."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about ComplyEasy and compliance management.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <a 
              href="mailto:support@complyeasy.com.au" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Contact our support team →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;