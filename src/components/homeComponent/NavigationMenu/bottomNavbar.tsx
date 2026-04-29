'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  PhoneCall, 
  User,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Schedule",
    path: "/schedule",
    icon: LayoutGrid,
  },
  {
    name: "Contact",
    path: "/contact-us",
    icon: PhoneCall,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const BottomNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6 pt-2">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex items-center justify-around p-2">
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="relative flex flex-col items-center justify-center p-3 transition-all duration-300"
            >
              {active && (
                <motion.div 
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-primary/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon 
                className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary' : 'text-slate-400'}`} 
              />
              <span className={`text-[10px] font-black uppercase mt-1 tracking-widest transition-all duration-300 ${active ? 'text-primary' : 'text-slate-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
