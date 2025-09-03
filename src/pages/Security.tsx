import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Server, CheckCircle, Award, FileText, Globe } from "lucide-react";

const Security = () => {
  useEffect(() => {
    document.title = "Security & Privacy - ComplyEasy | Enterprise-Grade Protection for Compliance Data";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Learn about ComplyEasy\'s enterprise-grade security measures, data protection, privacy compliance, and certifications protecting your business compliance data.'
      );
    }
  }, []);

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption",
      details: [
        "TLS 1.3 for data transmission",
        "AES-256 encryption at rest",
        "Zero-knowledge architecture",
        "Encrypted database backups"
      ]
    },
    {
      icon: Lock,
      title: "Multi-Factor Authentication",
      description: "Secure access with multiple authentication factors",
      details: [
        "TOTP authenticator apps",
        "SMS verification backup",
        "Biometric authentication support",
        "SSO integration available"
      ]
    },
    {
      icon: Eye,
      title: "Access Controls",
      description: "Granular permissions and role-based access controls",
      details: [
        "Role-based access control (RBAC)",
        "Least privilege principles",
        "Audit trails for all actions",
        "Session management and timeout"
      ]
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description: "Enterprise-grade cloud infrastructure with multiple layers of protection",
      details: [
        "AWS SOC 2 compliant hosting",
        "DDoS protection and WAF",
        "Automated security monitoring",
        "Regular penetration testing"
      ]
    }
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Security, availability, and confidentiality controls",
      status: "Certified",
      icon: Award
    },
    {
      name: "ISO 27001",
      description: "Information security management systems",
      status: "In Progress", 
      icon: Award
    },
    {
      name: "GDPR Compliant",
      description: "General Data Protection Regulation compliance",
      status: "Compliant",
      icon: Globe
    },
    {
      name: "Privacy Act 1988",
      description: "Australian Privacy Principles compliance",
      status: "Compliant",
      icon: FileText
    }
  ];

  const dataProtection = [
    {
      aspect: "Data Location",
      detail: "All data stored in Australian AWS regions (Sydney & Melbourne)"
    },
    {
      aspect: "Data Backup", 
      detail: "Automated daily backups with 30-day retention and geo-replication"
    },
    {
      aspect: "Data Recovery",
      detail: "99.9% uptime SLA with automated failover and disaster recovery"
    },
    {
      aspect: "Data Retention",
      detail: "Configurable retention policies with secure deletion after retention period"
    },
    {
      aspect: "Data Portability",
      detail: "Export your data anytime in standard formats (CSV, JSON, PDF)"
    },
    {
      aspect: "Data Deletion",
      detail: "Complete data removal within 30 days of account cancellation"
    }
  ];

  const privacyPrinciples = [
    "We collect only the minimum data necessary for compliance management",
    "Your data is never shared with third parties without explicit consent",
    "You maintain full ownership and control of your compliance data",
    "Transparent data practices with clear privacy policies",
    "Regular security audits and vulnerability assessments",
    "Employee background checks and security training programs"
  ];

  const securityIncidentResponse = [
    {
      phase: "Detection",
      description: "24/7 monitoring with automated threat detection and alerting systems"
    },
    {
      phase: "Response",
      description: "Immediate incident response team activation with defined escalation procedures"
    },
    {
      phase: "Communication",
      description: "Transparent communication to affected customers within 24 hours of confirmation"
    },
    {
      phase: "Resolution",
      description: "Rapid containment and remediation with detailed post-incident reporting"
    }
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
                Security & Privacy
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Enterprise-grade</span> security
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Your compliance data is protected by multiple layers of security, 
                encryption, and industry-leading privacy practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Shield className="w-4 h-4 mr-2" />
                  View Security Report
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Multi-layered security protection
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive security measures protecting your data at every level
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Security certifications & compliance
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Independently verified security and privacy standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <cert.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <CardDescription className="text-sm">{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge 
                      variant={cert.status === 'Certified' || cert.status === 'Compliant' ? 'default' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {cert.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Data protection & management
                </h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive data protection with full transparency and control
                </p>
              </div>

              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {dataProtection.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-primary mb-1">{item.aspect}</h3>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Privacy principles
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our commitment to protecting your privacy and data
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {privacyPrinciples.map((principle, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Incident Response */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Security incident response
                </h2>
                <p className="text-xl text-muted-foreground">
                  Prepared response procedures for any security events
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityIncidentResponse.map((phase, index) => (
                  <Card key={index} className="text-center p-6">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-3">{phase.phase}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Contact */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                Security questions or concerns?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our security team is available to address any questions about our security practices, 
                privacy policies, or compliance certifications.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-heading font-semibold mb-3">Security Inquiries</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    General security questions and information requests
                  </p>
                  <Button className="w-full">
                    security@complyeasy.com.au
                  </Button>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-heading font-semibold mb-3">Vulnerability Reports</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Responsible disclosure of security vulnerabilities
                  </p>
                  <Button variant="outline" className="w-full">
                    security-reports@complyeasy.com.au
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Trust ComplyEasy with your compliance data
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Enterprise-grade security, Australian data hosting, and transparent privacy practices 
                you can rely on for your business compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Start Secure Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Security Documentation
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

export default Security;