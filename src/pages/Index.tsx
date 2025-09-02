import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DomainCards from "@/components/DomainCards";
import HowItWorks from "@/components/HowItWorks";
import PricingPreview from "@/components/PricingPreview";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "ComplyEasy - Compliance Made Simple for Small Business | Food Safety, WHS, Fire, Test & Tag";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Streamline your small business compliance with ComplyEasy. Preloaded state templates, smart reminders, and one-click audit packs for Food Safety 3.2.2A, WHS, Fire Safety, and Test & Tag compliance.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <DomainCards />
        <HowItWorks />
        <PricingPreview />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
