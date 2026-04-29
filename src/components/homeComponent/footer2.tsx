'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/gublogo.png";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Bus,
  ShieldCheck,
  Globe,
  Youtube,
  Linkedin
} from "lucide-react";

const Footer2: React.FC = () => {
  return (
    <footer className="bg-background border-t pt-24 pb-12 overflow-hidden relative">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white shadow-sm border border-border p-2 rounded-xl group-hover:scale-110 transition-transform duration-500">
                <Image src={Logo} alt="GUB Logo" width={36} height={36} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                GUB<span className="text-primary">BUS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-sm">
              Empowering the Green University community with a high-precision, real-time bus management system designed for seamless campus transit.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-foreground font-black tracking-widest uppercase text-[10px]">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'Schedule', 'Book Trip', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-foreground font-black tracking-widest uppercase text-[10px]">Ecosystem</h4>
            <ul className="space-y-4">
              {[
                { name: 'Live Tracking', icon: MapPin },
                { name: 'Fleet Status', icon: Bus },
                { name: 'Safety Logs', icon: ShieldCheck },
                { name: 'Global Routes', icon: Globe },
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary/60 shrink-0">
                    <item.icon size={14} />
                  </div>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-foreground font-black tracking-widest uppercase text-[10px]">Support Center</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border group hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Email Support</p>
                    <p className="text-foreground font-bold text-sm">transport@green.edu.bd</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border group hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Emergency Helpline</p>
                    <p className="text-foreground font-bold text-sm">+880 1711-223344</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <p className="text-xs font-bold text-muted-foreground">
              &copy; {new Date().getFullYear()} Green University Of Bangladesh.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
