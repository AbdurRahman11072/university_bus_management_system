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
  Globe
} from "lucide-react";

const Footer2: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Image src={Logo} alt="GUB Logo" width={40} height={40} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                GUB <span className="text-primary italic">BUS</span>
              </span>
            </Link>
            <p className="text-lg leading-relaxed text-slate-400 font-medium max-w-sm">
              Revolutionizing campus transit with high-precision tracking and seamless booking for the next generation of students.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Schedule', 'Book Trip', 'Contact Us', 'Notice'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Features</h4>
            <ul className="space-y-4">
              {[
                { name: 'Live Tracking', icon: MapPin },
                { name: 'Seat Booking', icon: Bus },
                { name: 'Safety First', icon: ShieldCheck },
                { name: 'Multi-Route', icon: Globe },
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-3 text-slate-400">
                  <item.icon size={16} className="text-primary/50" />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Get in Touch</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-black mb-1">Email Support</p>
                  <p className="text-white font-bold">support@gubbus.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-black mb-1">Call Anytime</p>
                  <p className="text-white font-bold">+880 1234-567890</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-black mb-1">Main Campus</p>
                  <p className="text-white font-bold text-sm">Purbachal American City, Dhaka</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-bold">Green University Of Bangladesh.</span>
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
