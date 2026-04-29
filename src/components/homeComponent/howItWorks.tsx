'use client';

import { motion } from 'framer-motion';
import { UserPlus, ClipboardList, Bus, MapPin } from 'lucide-react';
import { SectionHeader } from './sectionHeader';

const steps = [
  {
    step: "01",
    title: "Seamless Registration",
    description: "Onboard in seconds with your university credentials and unlock the full potential of campus travel.",
    icon: UserPlus,
    color: "bg-blue-600",
    gradient: "from-blue-500/20 to-blue-500/0"
  },
  {
    step: "02",
    title: "Route Preference",
    description: "Complete a quick commute survey so we can optimize bus frequency based on your actual needs.",
    icon: ClipboardList,
    color: "bg-purple-600",
    gradient: "from-purple-500/20 to-purple-500/0"
  },
  {
    step: "03",
    title: "Intelligent Booking",
    description: "Browse optimized routes and reserve your seat instantly with our real-time availability engine.",
    icon: Bus,
    color: "bg-orange-600",
    gradient: "from-orange-500/20 to-orange-500/0"
  },
  {
    step: "04",
    title: "Live Command Center",
    description: "Experience the power of live tracking. Watch your bus move in real-time and get precise ETAs.",
    icon: MapPin,
    color: "bg-emerald-600",
    gradient: "from-emerald-500/20 to-emerald-500/0"
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header - Kept as per request */}
        <SectionHeader 
          badge="Efficiency Redefined"
          title="Your Journey,"
          accentTitle="Simplified"
          description="Our intelligent workflow is designed to get you from your doorstep to the campus with absolute zero friction."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative group p-8 md:p-12 rounded-[3rem] border border-border/50 bg-muted/30 hover:bg-background transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${
                index % 2 === 1 ? 'md:translate-y-12' : ''
              }`}
            >
              {/* Background Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon size={32} />
                  </div>
                  <span className="text-6xl font-black text-muted/20 group-hover:text-primary/20 transition-colors">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-8 pt-8 border-t border-border/50 flex items-center gap-4 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  EXPLORE FEATURE
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
