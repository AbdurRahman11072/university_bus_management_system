'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const GetStarted = () => {
  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 py-24 shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-md border border-white/10">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Join the community today</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
            Elevate Your Daily <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Commute Experience</span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Register now to access real-time tracking, personalized routes, 
            and a seamless booking experience tailored for GUB students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-10 text-lg rounded-2xl shadow-lg shadow-primary/25 transition-all hover:translate-y-[-2px]">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact-us" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-14 px-10 text-lg rounded-2xl backdrop-blur-md transition-all">
                Contact Support
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Free for Students
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              24/7 Support
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Real-time Updates
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStarted;
