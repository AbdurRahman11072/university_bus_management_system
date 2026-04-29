'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { SectionHeader } from './sectionHeader';

export function LiveStatusPreview() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <SectionHeader 
              badge="Intelligence"
              title="Real-Time Fleet"
              accentTitle="Tracking"
              description="Never miss your bus again. Our advanced GPS tracking system provides pinpoint accuracy for every vehicle in our fleet, updated every second."
              align="left"
            />
            <ul className="space-y-4 pt-4">
              {['Live GPS positioning', 'Estimated arrival times (ETA)', 'Traffic condition alerts'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative bg-muted rounded-[2rem] p-4 shadow-2xl border border-border/50 aspect-square max-w-[500px] mx-auto overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i19293!3i12461!2m3!1e0!2sm!3i668045582!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425!23i4111425')] bg-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
              
              {/* Animated Bus Markers */}
              <motion.div 
                animate={{ 
                  x: [100, 200, 150, 100],
                  y: [100, 150, 200, 100],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute z-10"
              >
                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                  <Navigation className="rotate-45" size={20} />
                </div>
                <div className="mt-2 bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm whitespace-nowrap text-[10px] font-bold">
                  Route A - Bus 04
                </div>
              </motion.div>

              <motion.div 
                animate={{ 
                  x: [300, 250, 350, 300],
                  y: [200, 300, 250, 200],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute z-10"
              >
                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Navigation className="rotate-[120deg]" size={20} />
                </div>
                <div className="mt-2 bg-background/90 backdrop-blur-sm border p-2 rounded-lg shadow-sm whitespace-nowrap text-[10px] font-bold">
                  Route B - Bus 12
                </div>
              </motion.div>

              {/* Glassmorphism UI Element */}
              <div className="absolute bottom-8 left-8 right-8 bg-background/60 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Next Arrival</h4>
                  <span className="text-primary font-bold">2 mins</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
