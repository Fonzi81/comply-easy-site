import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Flame, Shield, Users, AlertTriangle, Calendar } from "lucide-react";

const FireSafety = () => {
  useEffect(() => {
    document.title = "Fire Safety Compliance - ComplyEasy | Equipment Testing & Emergency Procedures";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete fire safety compliance management including extinguisher servicing, evacuation procedures, and fire warden training. Australian fire safety standards.'
      );
    }
  }, []);

  const requirements = [
    {
      icon: Shield,
      title: "Equipment Maintenance",
      description: "Scheduled fire safety equipment testing and maintenance",
      details: ["Fire extinguisher servicing", "Emergency lighting testing", "Fire alarm system checks", "Sprinkler system maintenance"]
    },
    {
      icon: Users,
      title: "Fire Warden Training",
      description: "Fire warden appointment and training management",
      details: ["Fire warden appointments", "Training certifications", "Evacuation leadership", "Emergency response procedures"]
    },
    {
      icon: AlertTriangle,
      title: "Emergency Procedures",
      description: "Comprehensive emergency planning and evacuation procedures",
      details: ["Evacuation plans", "Assembly point designation", "Emergency contacts", "Communication protocols"]
    },
    {
      icon: Calendar,
      title: "Compliance Scheduling",
      description: "Automated scheduling for all fire safety requirements",
      details: ["Annual fire safety statements", "Equipment testing intervals", "Training renewal dates", "Inspection schedules"]
    }
  ];

  const equipmentSchedule = [
    { equipment: "Portable Fire Extinguishers", interval: "6 months", standard: "AS 1851.1" },
    { equipment: "Fire Hose Reels", interval: "6 months", standard: "AS 1851.2" },
    { equipment: "Emergency & Exit Lighting", interval: "6 months", standard: "AS 2293" },
    { equipment: "Fire Detection Systems", interval: "Annual", standard: "AS 1851.4" },
    { equipment: "Sprinkler Systems", interval: "Annual", standard: "AS 1851.3" },
    { equipment: "Fire Doors & Hardware", interval: "6 months", standard: "AS 1851.6" }
  ];

  const buildingTypes = [
    {
      type: "Class 3 - Residential Care",
      requirements: ["Evacuation plans", "Fire warden training", "Monthly equipment checks", "Annual fire safety statement"],
      industries: ["Aged care", "Hostels", "Boarding houses"]
    },
    {
      type: "Class 5 - Office Buildings", 
      requirements: ["Emergency procedures", "Equipment maintenance", "Fire warden appointments", "Evacuation drills"],
      industries: ["Corporate offices", "Professional services", "Government buildings"]
    },
    {
      type: "Class 6 - Shops & Retail",
      requirements: ["Customer evacuation plans", "Staff training", "Equipment servicing", "Emergency lighting"],
      industries: ["Shopping centres", "Retail stores", "Markets"]
    },
    {
      type: "Class 9 - Public Buildings",
      requirements: ["Mass evacuation procedures", "Specialized equipment", "Enhanced training", "Regular drills"],
      industries: ["Schools", "Hospitals", "Entertainment venues"]
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
                Fire Safety Compliance
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Fire safety</span> that protects lives
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Comprehensive fire safety compliance management. Equipment servicing, 
                emergency procedures, and fire warden training all scheduled and tracked automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start fire safety compliance
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Download evacuation template
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Requirements */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Complete fire safety management
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need for fire safety compliance and emergency preparedness
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {requirements.map((requirement, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <requirement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{requirement.title}</CardTitle>
                    <CardDescription>{requirement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {requirement.details.map((detail, i) => (
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

        {/* Equipment Schedule */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Equipment testing & maintenance schedule
              </h2>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <span>Australian Standard Compliance</span>
                  </CardTitle>
                  <CardDescription>
                    All equipment testing scheduled according to Australian Standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold">Equipment Type</th>
                          <th className="text-left p-4 font-semibold">Testing Interval</th>
                          <th className="text-left p-4 font-semibold">Australian Standard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipmentSchedule.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-4 font-medium">{item.equipment}</td>
                            <td className="p-4">
                              <Badge variant="outline">{item.interval}</Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{item.standard}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-heading font-semibold">Automated Scheduling</h3>
                </div>
                <p className="text-muted-foreground">
                  Never miss equipment testing again. ComplyEasy automatically schedules all fire safety 
                  equipment maintenance according to Australian Standards and sends reminders before due dates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Building Classifications */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Building class-specific requirements
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tailored fire safety requirements for different building classifications
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {buildingTypes.map((building, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{building.type}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {building.industries.map((industry, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3">Key Requirements:</h4>
                    <ul className="space-y-2">
                      {building.requirements.map((req, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Procedures */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Emergency procedures & evacuation planning
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Fire detection procedures, alarm activation, and immediate response protocols.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Evacuation</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe evacuation routes, assembly points, and occupant management procedures.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Fire brigade notification, equipment use, and post-evacuation procedures.
                  </p>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="text-xl font-heading font-bold mb-4 text-center">
                    Fire Warden Training Program
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Training Includes:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Fire behaviour and hazards</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Evacuation procedures</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Equipment operation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Communication protocols</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Certification:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Initial training certification</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Annual refresher training</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Competency assessment</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>Digital record keeping</span>
                        </li>
                      </ul>
                    </div>
                  </div>
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
                Protect lives with proper fire safety
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Ensure your fire safety compliance is always current with automated scheduling, 
                comprehensive training, and proper emergency procedures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start fire safety compliance
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Schedule fire safety assessment
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

export default FireSafety;