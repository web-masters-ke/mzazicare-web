"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    content:
      "Finding a caregiver for my mother was overwhelming until I found MzaziCare. Within days, we were matched with Sarah, who has become like family. The peace of mind is priceless.",
    author: "Michelle K.",
    role: "Daughter of care recipient",
    location: "Nairobi",
    rating: 5,
  },
  {
    id: 2,
    content:
      "As a caregiver, MzaziCare has transformed my career. The platform connects me with families who truly value what I do, and the support from the team is exceptional.",
    author: "Grace M.",
    role: "Professional Caregiver",
    location: "Mombasa",
    rating: 5,
  },
  {
    id: 3,
    content:
      "The real-time updates and GPS tracking give us comfort knowing Dad is safe. We can see exactly when the caregiver arrives and get detailed reports after each visit.",
    author: "James O.",
    role: "Son of care recipient",
    location: "Kisumu",
    rating: 5,
  },
  {
    id: 4,
    content:
      "What sets MzaziCare apart is their verification process. We could see the caregiver's background check, certifications, and reviews from other families before making a decision.",
    author: "Catherine W.",
    role: "Family caregiver coordinator",
    location: "Nakuru",
    rating: 5,
  },
];

export function TestimonialsScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  return (
    <SceneWrapper id="testimonials" className="bg-[var(--color-bg-secondary)]" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-0 right-0 opacity-15"
        />
        <GradientOrb
          color="white"
          size="lg"
          blur="heavy"
          className="bottom-0 left-0 opacity-10"
        />

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <AnimatedText animation="fade-up">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
              Stories of Care
            </p>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-fg)] mb-6">
              Families who found{" "}
              <span className="text-brand-accent">peace of mind</span>
            </h2>
          </AnimatedText>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatedText animation="scale-in" delay={200}>
            <GlassCard variant="liquid" className="p-8 md:p-10 relative">
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-16 h-16 text-brand-accent/10" />

              {/* Content */}
              <div
                className={cn(
                  "transition-all duration-500",
                  isAnimating && "opacity-0 translate-y-4"
                )}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-brand-accent text-brand-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl text-[var(--color-fg)]/90 leading-relaxed mb-8 font-light">
                  &ldquo;{testimonials[activeIndex].content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-light flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeIndex].author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-fg)]">
                      {testimonials[activeIndex].author}
                    </p>
                    <p className="text-sm text-[var(--color-fg-subtle)]">
                      {testimonials[activeIndex].role} •{" "}
                      {testimonials[activeIndex].location}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedText>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setActiveIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    activeIndex === index
                      ? "w-8 bg-brand-accent"
                      : "w-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-medium)]"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full glass-subtle hover:bg-[var(--glass-bg)] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--color-fg)]" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full glass-subtle hover:bg-[var(--glass-bg)] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-[var(--color-fg)]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
