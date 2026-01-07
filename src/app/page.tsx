import { Navbar } from "@/components/navigation/Navbar";
import { HeroScene } from "@/components/sections/HeroScene";
import { PartnersScene } from "@/components/sections/PartnersScene";
import { HowItWorksScene } from "@/components/sections/HowItWorksScene";
import { StatsScene } from "@/components/sections/StatsScene";
import { ServicesScene } from "@/components/sections/ServicesScene";
import { CaregiverSpotlight } from "@/components/sections/CaregiverSpotlight";
import { TrustSafetyScene } from "@/components/sections/TrustSafetyScene";
import { AppPreviewScene } from "@/components/sections/AppPreviewScene";
import { PricingScene } from "@/components/sections/PricingScene";
import { TestimonialsScene } from "@/components/sections/TestimonialsScene";
import { FAQScene } from "@/components/sections/FAQScene";
import { CTAScene } from "@/components/sections/CTAScene";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero - Immersive entry point */}
        <HeroScene />

        {/* Partners - Social proof marquee */}
        <PartnersScene />

        {/* How it works - Process explanation */}
        <HowItWorksScene />

        {/* Stats - Impact numbers with animation */}
        <StatsScene />

        {/* Services - Interactive service selector */}
        <ServicesScene />

        {/* Caregiver Spotlight - Featured caregivers */}
        <CaregiverSpotlight />

        {/* Trust & Safety - Verification features */}
        <TrustSafetyScene />

        {/* App Preview - Phone mockup */}
        <AppPreviewScene />

        {/* Pricing - Plan cards */}
        <PricingScene />

        {/* Testimonials - Customer stories */}
        <TestimonialsScene />

        {/* FAQ - Accordion */}
        <FAQScene />

        {/* CTA - Final conversion */}
        <CTAScene />
      </main>
      <Footer />
    </>
  );
}
