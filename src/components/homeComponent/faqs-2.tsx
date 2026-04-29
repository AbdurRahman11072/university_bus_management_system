"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { SectionHeader } from "./sectionHeader";

export default function FAQsTwo() {
  const faqItems = [
    {
      id: "item-1",
      question: "How can I see the bus schedule?",
      answer:
        "You can view the complete bus schedule from the Bus Schedule section. It shows route, time, and bus number.",
    },
    {
      id: "item-2",
      question: "Do I need to log in to see bus information?",
      answer:
        "No. Basic information like routes and schedules is available without login. Login is required for profile features.",
    },
    {
      id: "item-3",
      question: "Is the bus service free for students?",
      answer:
        "Yes, the bus service is provided by Green University for registered students only.",
    },
    {
      id: "item-4",
      question: "What should I do if I miss my bus?",
      answer:
        "If you miss your bus, please wait for the next available schedule or contact the transport office.",
    },
    {
      id: "item-5",
      question: "Can teachers and staff use the same system?",
      answer:
        "Yes, teachers and staff can use the system with their valid university credentials.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeader 
          badge="Support Center"
          title="Frequently Asked"
          accentTitle="Questions"
          description="Discover quick and comprehensive answers to common questions about our platform, services, and features."
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border rounded-2xl px-6 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="cursor-pointer text-lg font-semibold py-6 hover:no-underline hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Can't find what you're looking for?{" "}
              <Link href="/contact-us" className="text-primary font-bold hover:underline underline-offset-4">
                Talk to our support team
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
