"use client";

import { useState } from "react";
import {
  Stethoscope,
  Utensils,
  Car,
  Pill,
  Heart,
  Home,
  ChevronRight,
} from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Home,
    title: "Daily Living Assistance",
    shortDesc: "Help with everyday activities",
    description:
      "Support with bathing, dressing, grooming, mobility assistance, and maintaining a comfortable living environment.",
    features: [
      "Personal hygiene",
      "Light housekeeping",
      "Mobility support",
      "Safety supervision",
    ],
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: Pill,
    title: "Medication Management",
    shortDesc: "Organized medication routines",
    description:
      "Ensuring medications are taken correctly and on time, with detailed tracking and family notifications.",
    features: [
      "Dosage reminders",
      "Refill coordination",
      "Side effect monitoring",
      "Doctor communication",
    ],
    color: "from-purple-500/20 to-purple-600/20",
  },
  {
    icon: Utensils,
    title: "Meal Preparation",
    shortDesc: "Nutritious home-cooked meals",
    description:
      "Preparing healthy, delicious meals tailored to dietary needs and preferences, including special diets.",
    features: [
      "Diet-specific meals",
      "Grocery shopping",
      "Feeding assistance",
      "Nutrition tracking",
    ],
    color: "from-green-500/20 to-green-600/20",
  },
  {
    icon: Car,
    title: "Transportation",
    shortDesc: "Safe rides to appointments",
    description:
      "Reliable transportation to medical appointments, social activities, errands, and family visits.",
    features: [
      "Medical appointments",
      "Social outings",
      "Errands & shopping",
      "Safe accompaniment",
    ],
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    icon: Stethoscope,
    title: "Health Monitoring",
    shortDesc: "Proactive health tracking",
    description:
      "Regular vital sign monitoring, health status reporting, and coordination with healthcare providers.",
    features: [
      "Vital sign checks",
      "Symptom tracking",
      "Doctor coordination",
      "Emergency response",
    ],
    color: "from-red-500/20 to-red-600/20",
  },
  {
    icon: Heart,
    title: "Companionship",
    shortDesc: "Meaningful connection",
    description:
      "Engaging conversation, recreational activities, and emotional support to combat loneliness and isolation.",
    features: [
      "Conversation & games",
      "Hobby activities",
      "Social engagement",
      "Emotional support",
    ],
    color: "from-pink-500/20 to-pink-600/20",
  },
];

export function ServicesScene() {
  const [activeService, setActiveService] = useState(0);

  const ActiveIcon = services[activeService].icon;

  return (
    <SceneWrapper id="services" className="bg-black" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
        />

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <AnimatedText animation="fade-up">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
              Comprehensive Care
            </p>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Services tailored to{" "}
              <span className="text-brand-accent">your needs</span>
            </h2>
          </AnimatedText>
        </div>

        {/* Interactive Service Selector */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service List */}
          <div className="lg:col-span-1 space-y-3">
            {services.map((service, index) => (
              <AnimatedText
                key={service.title}
                animation="fade-up"
                delay={200 + index * 50}
              >
                <button
                  onClick={() => setActiveService(index)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-300",
                    "flex items-center gap-4 group",
                    activeService === index
                      ? "glass border-brand-accent/30 bg-brand-accent/10"
                      : "hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      activeService === index
                        ? "bg-brand-accent text-white"
                        : "bg-white/10 text-white/60"
                    )}
                  >
                    <service.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-medium transition-colors truncate",
                        activeService === index ? "text-white" : "text-white/70"
                      )}
                    >
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/40 truncate">
                      {service.shortDesc}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 transition-all flex-shrink-0",
                      activeService === index
                        ? "text-brand-accent translate-x-1"
                        : "text-white/20"
                    )}
                  />
                </button>
              </AnimatedText>
            ))}
          </div>

          {/* Service Detail Card */}
          <div className="lg:col-span-2">
            <AnimatedText animation="scale-in" delay={400}>
              <GlassCard
                variant="liquid"
                className="h-full p-8 relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-30 transition-all duration-500",
                    services[activeService].color
                  )}
                />

                <div className="relative z-10">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 flex items-center justify-center">
                      <ActiveIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {services[activeService].title}
                      </h3>
                      <p className="text-white/50">
                        {services[activeService].shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {services[activeService].description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {services[activeService].features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-white/60"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <GlassButton variant="primary">
                    Learn More About This Service
                  </GlassButton>
                </div>
              </GlassCard>
            </AnimatedText>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
