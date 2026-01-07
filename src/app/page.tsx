import { Navbar } from "@/components/navigation/Navbar";
import { HeroScene } from "@/components/sections/HeroScene";
import { HowItWorksScene } from "@/components/sections/HowItWorksScene";
import { TrustSafetyScene } from "@/components/sections/TrustSafetyScene";
import { ServicesScene } from "@/components/sections/ServicesScene";
import { TestimonialsScene } from "@/components/sections/TestimonialsScene";
import { CTAScene } from "@/components/sections/CTAScene";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroScene />
        <HowItWorksScene />
        <TrustSafetyScene />
        <ServicesScene />
        <TestimonialsScene />
        <CTAScene />
      </main>
      <Footer />
    </>
  );
}
