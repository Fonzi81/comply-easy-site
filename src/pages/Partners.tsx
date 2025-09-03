import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Award, ExternalLink, Mail, Phone, CheckCircle } from "lucide-react";

const Partners = () => {
  useEffect(() => {
    document.title = "Partners - ComplyEasy | Compliance Consultants & Integration Partners";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Partner with ComplyEasy as a compliance consultant, reseller, or technology integrator. Join our partner network to help Australian businesses achieve compliance.'
      );
    }
  }, []);

  const partnerTypes = [
    {
      title: "Compliance Consultants",
      description: "Help your clients with automated compliance management",
      icon: Award,
      benefits: [
        "White-label compliance solutions",
        "Partner portal for client management", 
        "Training and certification programs",
        "Ongoing technical support",
        "Revenue sharing opportunities"
      ],
      requirements: [
        "Compliance consulting experience",
        "Client base in target industries",
        "Commitment to training requirements"
      ]
    },
    {
      title: "Reseller Partners",
      description: "Sell ComplyEasy solutions to your customer network",
      icon: Building2,
      benefits: [
        "Competitive reseller margins",
        "Sales and marketing support",
        "Lead generation assistance",
        "Technical training included",
        "Dedicated partner manager"
      ],
      requirements: [
        "Established sales channel",
        "Understanding of compliance market",
        "Minimum sales commitments"
      ]
    },
    {
      title: "Technology Integrators", 
      description: "Integrate ComplyEasy with existing business systems",
      icon: Users,
      benefits: [
        "API access and documentation",
        "Technical integration support",
        "Developer resources and tools",
        "Co-marketing opportunities",
        "Referral program participation"
      ],
      requirements: [
        "Software development capabilities",
        "Experience with business integrations",
        "Technical certification completion"
      ]
    }
  ];

  const currentPartners = [
    {
      name: "Compliance First Consulting",
      type: "Compliance Consultant",
      location: "Sydney, NSW",
      specialties: ["Food Safety", "WHS"],
      description: "Leading food safety and workplace health consultancy serving NSW and ACT",
      verified: true
    },
    {
      name: "SafeWork Solutions",
      type: "Compliance Consultant", 
      location: "Brisbane, QLD",
      specialties: ["WHS", "Fire Safety"],
      description: "Workplace safety specialists with 15+ years experience in Queensland",
      verified: true
    },
    {
      name: "TechIntegrate Australia",
      type: "Technology Partner",
      location: "Melbourne, VIC",
      specialties: ["API Integration", "Custom Solutions"],
      description: "Software integration specialists for business management systems",
      verified: true
    },
    {
      name: "Business Solutions Network",
      type: "Reseller Partner",
      location: "Perth, WA",
      specialties: ["Small Business", "Retail"],
      description: "Business software and services provider for WA small businesses",
      verified: true
    }
  ];

  const partnerBenefits = [
    "Dedicated partner success manager",
    "Comprehensive training and certification",
    "Marketing co-op opportunities",
    "Priority technical support",
    "Access to partner-only resources",
    "Quarterly partner events and networking"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="carbon-bg py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 border-carbon-foreground/20 text-carbon-foreground">
                Partner Network
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Partner</span> with ComplyEasy
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Join our network of compliance consultants, resellers, and technology partners 
                helping Australian businesses achieve and maintain compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Mail className="w-4 h-4 mr-2" />
                  Apply to Partner
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Partner Enquiry Call
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the partnership model that fits your business and expertise
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {partnerTypes.map((partnerType, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <partnerType.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{partnerType.title}</CardTitle>
                    <CardDescription>{partnerType.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Partner Benefits:</h4>
                      <ul className="space-y-2">
                        {partnerType.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {partnerType.requirements.map((req, i) => (
                          <li key={i} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Current Partners */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Our Partner Network
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Meet some of our trusted partners across Australia
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentPartners.map((partner, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center space-x-2">
                          <span>{partner.name}</span>
                          {partner.verified && (
                            <Badge variant="outline" className="text-xs text-green-700 border-green-700">
                              Verified Partner
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {partner.type} • {partner.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg">
                View All Partners
              </Button>
            </div>
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Why Partner with ComplyEasy?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Access comprehensive support and resources to grow your business
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {partnerBenefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">{benefit}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-6">
                  {partnerBenefits.slice(3).map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">{benefit}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-heading font-bold mb-4">
                    Ready to Join Our Partner Network?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Whether you're a compliance consultant, technology integrator, or reseller, 
                    we have partnership opportunities that can help grow your business.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Submit Partner Application
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Schedule Partner Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Application Process */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Partnership Application Process
                </h2>
                <p className="text-xl text-muted-foreground">
                  Simple steps to become a ComplyEasy partner
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Apply Online",
                    description: "Complete our partner application form with your business details and partnership interests"
                  },
                  {
                    step: "2", 
                    title: "Initial Review",
                    description: "Our partnership team reviews your application and business fit within 3-5 business days"
                  },
                  {
                    step: "3",
                    title: "Partner Interview",
                    description: "Schedule a call to discuss partnership opportunities and answer any questions"
                  },
                  {
                    step: "4",
                    title: "Onboarding",
                    description: "Complete training, receive partner materials, and start working with clients"
                  }
                ].map((step, index) => (
                  <Card key={index} className="text-center p-6">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Ready to grow your business with ComplyEasy?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Join our partner network and help Australian businesses achieve compliance while growing your revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Mail className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Partner Enquiry
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partners;