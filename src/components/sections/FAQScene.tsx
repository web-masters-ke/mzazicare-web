"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How are caregivers verified?",
    answer:
      "Every caregiver goes through our rigorous 7-step verification process including national ID verification, criminal background checks, reference checks, skills assessment, health screening, training verification, and an in-person interview. Only about 15% of applicants make it through our vetting process.",
  },
  {
    question: "Can I choose my own caregiver?",
    answer:
      "Absolutely! You can browse caregiver profiles, view their qualifications, read reviews from other families, and select the caregiver that best fits your needs. You can also let our matching algorithm recommend caregivers based on your specific requirements.",
  },
  {
    question: "What happens in case of an emergency?",
    answer:
      "Our caregivers are trained in basic first aid and emergency protocols. In case of a medical emergency, they will immediately contact emergency services and notify you. Our 24/7 support team is always available to coordinate emergency responses and provide guidance.",
  },
  {
    question: "How does scheduling work?",
    answer:
      "You can book care sessions through our app or website. Choose from one-time visits, recurring schedules (daily, weekly, monthly), or request immediate care for urgent needs. You can easily modify or cancel bookings with our flexible scheduling system.",
  },
  {
    question: "What services do caregivers provide?",
    answer:
      "Our caregivers offer a wide range of services including daily living assistance, medication management, meal preparation, companionship, transportation, health monitoring, light housekeeping, and specialized care for conditions like dementia or post-surgery recovery.",
  },
  {
    question: "How do payments work?",
    answer:
      "We accept M-Pesa, credit/debit cards, and bank transfers. Subscription plans are billed monthly or annually. For pay-per-service, you're only charged for completed visits. All transactions are secure and you receive detailed receipts for every payment.",
  },
  {
    question: "Can I track caregiver visits?",
    answer:
      "Yes! Our app provides real-time GPS tracking so you can see when the caregiver arrives and leaves. You also receive instant notifications for check-ins and check-outs, plus detailed visit reports including tasks completed and any observations.",
  },
  {
    question: "What if I'm not satisfied with a caregiver?",
    answer:
      "Your satisfaction is our priority. If you're not happy with a caregiver, you can request a different one at any time at no extra cost. Our support team will work with you to find a better match and address any concerns promptly.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <AnimatedText animation="fade-up" delay={200 + index * 50}>
      <div
        className={cn(
          "border-b border-[var(--glass-border)] last:border-b-0",
          "transition-all duration-300"
        )}
      >
        <button
          onClick={onToggle}
          className={cn(
            "w-full py-6 flex items-start justify-between gap-4 text-left",
            "group transition-colors"
          )}
        >
          <span
            className={cn(
              "text-lg font-medium transition-colors",
              isOpen ? "text-brand-accent" : "text-[var(--color-fg)] group-hover:text-[var(--color-fg-muted)]"
            )}
          >
            {faq.question}
          </span>
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-300",
              isOpen
                ? "bg-brand-accent text-white rotate-180"
                : "bg-[var(--glass-bg-subtle)] text-[var(--color-fg-subtle)] group-hover:bg-[var(--glass-bg)]"
            )}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-500",
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <p className="text-[var(--color-fg-muted)] leading-relaxed pr-12">{faq.answer}</p>
        </div>
      </div>
    </AnimatedText>
  );
}

export function FAQScene() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SceneWrapper id="faq" className="bg-[var(--color-bg)]" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="secondary"
          size="xl"
          blur="heavy"
          className="-top-32 -left-32 opacity-10"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <AnimatedText animation="fade-up">
              <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
                Got Questions?
              </p>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-fg)] mb-6">
                Frequently asked{" "}
                <span className="text-brand-accent">questions</span>
              </h2>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={200}>
              <p className="text-xl text-[var(--color-fg-muted)] mb-8">
                Can&apos;t find what you&apos;re looking for? Our support team is
                here to help.
              </p>
            </AnimatedText>
            <AnimatedText animation="fade-up" delay={300}>
              <GlassButton variant="secondary" className="group">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </GlassButton>
            </AnimatedText>

            {/* Stats */}
            <AnimatedText animation="fade-up" delay={400}>
              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-[var(--glass-bg-subtle)]">
                  <p className="text-3xl font-bold text-[var(--color-fg)] mb-1">{"<"}2min</p>
                  <p className="text-sm text-[var(--color-fg-subtle)]">Avg. response time</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--glass-bg-subtle)]">
                  <p className="text-3xl font-bold text-[var(--color-fg)] mb-1">24/7</p>
                  <p className="text-sm text-[var(--color-fg-subtle)]">Support available</p>
                </div>
              </div>
            </AnimatedText>
          </div>

          {/* Right Column - FAQ List */}
          <div className="glass-subtle rounded-3xl p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
