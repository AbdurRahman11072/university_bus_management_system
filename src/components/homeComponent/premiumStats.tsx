'use client';

import { motion } from 'framer-motion';
import { Bus, Users, MapPin, CheckCircle } from 'lucide-react';
import { SectionHeader } from './sectionHeader';

const stats = [
  { label: 'Total Buses', value: '50+', icon: Bus, color: 'bg-blue-500' },
  { label: 'Active Routes', value: '25+', icon: MapPin, color: 'bg-green-500' },
  { label: 'Students Served', value: '5000+', icon: Users, color: 'bg-purple-500' },
  { label: 'On-Time Trips', value: '99%', icon: CheckCircle, color: 'bg-orange-500' },
];

export function PremiumStats() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader 
          badge="Live Metrics"
          title="Fleet Operations in"
          accentTitle="Real-Time"
          description="A comprehensive overview of our current operations and the impact we've made in the campus community."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
