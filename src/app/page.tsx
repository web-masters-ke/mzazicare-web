import { LandingNav } from "@/components/navigation/LandingNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { HeroScene } from "@/components/sections/HeroScene";
import { FeaturesScene } from "@/components/sections/FeaturesScene";
import { HowItWorksScene } from "@/components/sections/HowItWorksScene";
import { ForFamilies } from "@/components/sections/ForFamilies";
import { ForCaregivers } from "@/components/sections/ForCaregivers";
import { LiveActivity } from "@/components/sections/LiveActivity";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { TestimonialsScene } from "@/components/sections/TestimonialsScene";
import { FAQScene } from "@/components/sections/FAQScene";
import { CTAScene } from "@/components/sections/CTAScene";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <LandingNav />
      <ThemeToggle />
      <main>
        {/* Hero - Bento grid layout */}
        <HeroScene />

        {/* Features - Bento grid with key features */}
        <div id="features">
          <FeaturesScene />
        </div>

        {/* How it works - 4-step process */}
        <div id="how-it-works">
          <HowItWorksScene />
        </div>

        {/* For Families - Dark background section */}
        <div id="for-families">
          <ForFamilies />
        </div>

        {/* For Caregivers - Light background section */}
        <div id="for-caregivers">
          <ForCaregivers />
        </div>

        {/* Live Activity - Real-time feed */}
        <LiveActivity />

        {/* Success Stories - Community testimonials */}
        <SuccessStories />

        {/* Testimonials - Customer reviews */}
        <TestimonialsScene />

        {/* FAQ - Accordion */}
        <div id="faq">
          <FAQScene />
        </div>

        {/* CTA - Final conversion */}
        <CTAScene />
      </main>
      <Footer />
    </>
  );
}
