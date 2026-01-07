"use client";

import { useState } from "react";
import { Star, MapPin, Clock, Award, ChevronRight } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const caregivers = [
  {
    id: 1,
    name: "Sarah Wanjiku",
    title: "Senior Care Specialist",
    location: "Nairobi",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    specialties: ["Dementia Care", "Mobility Support", "Medication Management"],
    bio: "Passionate about providing dignified care for the elderly. Certified in geriatric care with extensive experience in memory care.",
    gradient: "from-blue-500/20 to-purple-500/20",
    initials: "SW",
  },
  {
    id: 2,
    name: "Grace Achieng",
    title: "Certified Nursing Assistant",
    location: "Mombasa",
    experience: "5 years",
    rating: 4.8,
    reviews: 89,
    specialties: ["Post-Surgery Care", "Vital Monitoring", "Companionship"],
    bio: "Former hospital nurse turned home caregiver. I believe in treating every client like family.",
    gradient: "from-green-500/20 to-teal-500/20",
    initials: "GA",
  },
  {
    id: 3,
    name: "Mary Njeri",
    title: "Home Health Aide",
    location: "Kisumu",
    experience: "6 years",
    rating: 5.0,
    reviews: 156,
    specialties: ["Daily Living", "Meal Preparation", "Physical Therapy"],
    bio: "Dedicated to helping seniors maintain independence and quality of life in their own homes.",
    gradient: "from-orange-500/20 to-red-500/20",
    initials: "MN",
  },
  {
    id: 4,
    name: "Jane Muthoni",
    title: "Palliative Care Expert",
    location: "Nakuru",
    experience: "10 years",
    rating: 4.9,
    reviews: 203,
    specialties: ["End-of-Life Care", "Pain Management", "Family Support"],
    bio: "Providing compassionate care during life's most challenging moments. Every person deserves dignity.",
    gradient: "from-pink-500/20 to-rose-500/20",
    initials: "JM",
  },
];

export function CaregiverSpotlight() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <SceneWrapper className="bg-black" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-1/4 -right-32 opacity-20"
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <AnimatedText animation="fade-up">
              <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
                Meet Our Caregivers
              </p>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Exceptional people providing{" "}
                <span className="text-brand-accent">exceptional care</span>
              </h2>
            </AnimatedText>
          </div>
          <AnimatedText animation="fade-up" delay={200}>
            <GlassButton variant="secondary" className="group whitespace-nowrap">
              View All Caregivers
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </GlassButton>
          </AnimatedText>
        </div>

        {/* Caregivers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {caregivers.map((caregiver, index) => (
            <AnimatedText
              key={caregiver.id}
              animation="fade-up"
              delay={300 + index * 100}
            >
              <div
                className={cn(
                  "group relative rounded-3xl overflow-hidden",
                  "bg-gradient-to-br from-white/5 to-transparent",
                  "border border-white/5 hover:border-white/20",
                  "transition-all duration-500",
                  hoveredId === caregiver.id && "scale-[1.02]"
                )}
                onMouseEnter={() => setHoveredId(caregiver.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    caregiver.gradient
                  )}
                />

                <div className="relative z-10 p-6">
                  {/* Avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        "bg-gradient-to-br from-brand-accent to-brand-accent-light",
                        "text-white text-xl font-bold",
                        "transition-transform duration-300 group-hover:scale-110"
                      )}
                    >
                      {caregiver.initials}
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full glass-subtle">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-white">
                        {caregiver.rating}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {caregiver.name}
                  </h3>
                  <p className="text-brand-accent text-sm font-medium mb-3">
                    {caregiver.title}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {caregiver.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {caregiver.experience}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-white/50 mb-4 line-clamp-2">
                    {caregiver.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {caregiver.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/70"
                      >
                        {specialty}
                      </span>
                    ))}
                    {caregiver.specialties.length > 2 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/70">
                        +{caregiver.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Reviews count */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      {caregiver.reviews} reviews
                    </span>
                    <Award className="w-4 h-4 text-brand-accent" />
                  </div>
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </SceneWrapper>
  );
}
