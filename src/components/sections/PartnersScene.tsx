"use client";

import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/utils";

// Simulated partner logos using text (replace with actual logos)
const partners = [
  { name: "Safaricom", type: "partner" },
  { name: "KCB Bank", type: "partner" },
  { name: "Jubilee Health", type: "partner" },
  { name: "NHIF", type: "partner" },
  { name: "Kenya Red Cross", type: "partner" },
  { name: "Gertrude's Hospital", type: "partner" },
  { name: "Nairobi Hospital", type: "partner" },
  { name: "AAR Healthcare", type: "partner" },
];

const pressFeatures = [
  { name: "Daily Nation", quote: "Revolutionizing elderly care in Kenya" },
  { name: "Business Daily", quote: "The Uber of caregiving services" },
  { name: "TechCrunch", quote: "East Africa's leading caretech startup" },
  { name: "The Standard", quote: "Bridging the gap in senior care" },
];

export function PartnersScene() {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Partners Marquee */}
      <div className="mb-16">
        <AnimatedText animation="fade-up">
          <p className="text-center text-white/40 text-sm uppercase tracking-widest mb-8">
            Trusted by leading organizations
          </p>
        </AnimatedText>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          {/* Scrolling logos */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className={cn(
                    "flex-shrink-0 mx-8 md:mx-12",
                    "px-8 py-4 rounded-xl",
                    "border border-white/5 bg-white/[0.02]",
                    "hover:bg-white/5 transition-colors"
                  )}
                >
                  <span className="text-xl md:text-2xl font-bold text-white/30 whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Press Features */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedText animation="fade-up">
          <p className="text-center text-white/40 text-sm uppercase tracking-widest mb-8">
            As featured in
          </p>
        </AnimatedText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pressFeatures.map((press, index) => (
            <AnimatedText
              key={press.name}
              animation="fade-up"
              delay={200 + index * 100}
            >
              <div className="text-center group">
                <p className="text-xl font-bold text-white/20 group-hover:text-white/40 transition-colors mb-2">
                  {press.name}
                </p>
                <p className="text-sm text-white/40 italic">
                  &ldquo;{press.quote}&rdquo;
                </p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}
