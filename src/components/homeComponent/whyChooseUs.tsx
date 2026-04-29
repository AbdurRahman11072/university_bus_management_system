'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, Shield, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { SectionHeader } from "./sectionHeader";

const details = [
  {
    icon: Eye,
    title: "Live Tracking",
    description: "Get real-time updates on your bus location with high-precision GPS tracking.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Intelligent route planning and accurate arrival times at your fingertips.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Quick Booking",
    description: "Reserve your seat in seconds with our optimized one-tap booking system.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Bank-grade encryption ensures your transactions are always safe and private.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <SectionHeader 
          badge="Our Advantages"
          title="The Next Generation of"
          accentTitle="Campus Mobility"
          description="We've built everything you need to manage your bus journey efficiently, securely, and with complete peace of mind."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {details.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full border-none shadow-none group bg-transparent">
                <CardContent className="pt-0 p-0">
                  <div className="relative z-10 p-8 rounded-[2.5rem] bg-background border border-border/50 hover:border-primary/50 transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/5 group-hover:-translate-y-2">
                    <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <item.icon size={32} strokeWidth={2.5} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                      Learn More <ArrowRight size={16} />
                    </div>
                  </div>
                  
                  {/* Decorative Gradient Background on Hover */}
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
