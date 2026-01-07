"use client";

import { useState } from "react";
import {
  Smartphone,
  Bell,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  Heart,
} from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Instant notifications for arrivals, departures, and updates",
  },
  {
    icon: MapPin,
    title: "GPS Tracking",
    description: "Know exactly when and where care is being provided",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book and manage appointments with a few taps",
  },
  {
    icon: FileText,
    title: "Visit Reports",
    description: "Detailed summaries of every care session",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay seamlessly via M-Pesa or card",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Emergency SOS and 24/7 support access",
  },
];

const appScreens = [
  { id: "home", label: "Dashboard" },
  { id: "booking", label: "Book Care" },
  { id: "tracking", label: "Live Track" },
  { id: "reports", label: "Reports" },
];

export function AppPreviewScene() {
  const [activeScreen, setActiveScreen] = useState("home");

  return (
    <SceneWrapper className="bg-gradient-to-b from-zinc-950 to-black" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Phone Mockup */}
          <AnimatedText animation="scale-in" delay={200}>
            <div className="relative flex justify-center">
              {/* Glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 bg-brand-accent/30 rounded-full blur-[100px]" />
              </div>

              {/* Phone Frame */}
              <div className="relative">
                {/* Phone outer frame */}
                <div
                  className={cn(
                    "relative w-[280px] md:w-[320px] h-[580px] md:h-[640px]",
                    "rounded-[3rem] p-3",
                    "bg-gradient-to-b from-zinc-700 to-zinc-900",
                    "shadow-2xl shadow-black/50"
                  )}
                >
                  {/* Screen bezel */}
                  <div className="w-full h-full rounded-[2.5rem] bg-black overflow-hidden relative">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />

                    {/* Screen Content */}
                    <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black p-4 pt-14">
                      {/* Status bar */}
                      <div className="flex items-center justify-between text-white/60 text-xs mb-4 px-2">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 border border-white/60 rounded-sm">
                            <div className="w-3/4 h-full bg-white/60 rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-white/60 text-xs">Welcome back</p>
                          <p className="text-white font-semibold">Michelle K.</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-brand-accent" />
                        </div>
                      </div>

                      {/* Active Care Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-accent-dark mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            SW
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              Sarah is caring for Mom
                            </p>
                            <p className="text-white/70 text-xs">
                              Started 45 mins ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-white rounded-full" />
                          </div>
                          <span className="text-white/80 text-xs">75%</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { icon: Calendar, label: "Book Care" },
                          { icon: MapPin, label: "Track" },
                          { icon: FileText, label: "Reports" },
                          { icon: Heart, label: "Emergency" },
                        ].map((action) => (
                          <div
                            key={action.label}
                            className="p-3 rounded-xl bg-white/5 flex flex-col items-center gap-2"
                          >
                            <action.icon className="w-5 h-5 text-brand-accent" />
                            <span className="text-white/70 text-xs">
                              {action.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Upcoming */}
                      <div>
                        <p className="text-white/50 text-xs mb-2">UPCOMING</p>
                        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              Morning Check-in
                            </p>
                            <p className="text-white/50 text-xs">
                              Tomorrow, 8:00 AM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>

                {/* Floating elements around phone */}
                <div className="absolute -top-4 -right-4 md:-right-8 p-3 rounded-xl glass animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">
                      Live Tracking
                    </span>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 md:-left-8 p-3 rounded-xl glass animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-accent" />
                    <span className="text-white text-xs font-medium">
                      Verified Care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedText>

          {/* Right Column - Features */}
          <div>
            <AnimatedText animation="fade-up">
              <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
                MzaziCare App
              </p>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Care management in{" "}
                <span className="text-brand-accent">your pocket</span>
              </h2>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={200}>
              <p className="text-xl text-white/60 mb-10">
                Book caregivers, track visits, receive updates, and manage
                everything from our intuitive mobile app.
              </p>
            </AnimatedText>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <AnimatedText
                  key={feature.title}
                  animation="fade-up"
                  delay={300 + index * 50}
                >
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/50">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedText>
              ))}
            </div>

            {/* App Store Badges */}
            <AnimatedText animation="fade-up" delay={600}>
              <div className="flex flex-wrap gap-4 mt-10">
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <Smartphone className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase">
                      Coming soon on
                    </p>
                    <p className="text-white font-semibold">Google Play</p>
                  </div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <Smartphone className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase">
                      Coming soon on
                    </p>
                    <p className="text-white font-semibold">App Store</p>
                  </div>
                </div>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
