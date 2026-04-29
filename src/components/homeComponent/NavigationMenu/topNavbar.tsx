'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell,
  Bus,
  ChevronRight,
  Clock,
  CheckCircle2,
  Inbox,
  X,
  Megaphone,
  UserCheck,
  Calendar,
  Eye,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/config";
import Logo from "../../../../public/gublogo.png";
import Profile from "./profile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Schedule", path: "/schedule" },
  { name: "Book Trip", path: "/booktrip" },
  { name: "Contact", path: "/contact-us" },
];

const announcements = [
  "🚌 Book your tickets now! Special discounts available",
  "🌟 New routes added: Downtown Express & Airport Shuttle",
  "📱 Download our mobile app for exclusive offers",
];

const TopNavbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [notices, setNotices] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotices();
    }
  }, [isAuthenticated, user]);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_BASE}/notice/get-all-notice`);
      const data = await response.json();
      const allNotices = data.data || [];
      
      const userRole = (user as any)?.roles;
      const userId = (user as any)?._id;
      
      const filtered = allNotices.filter((n: any) => 
        n.noticeFor === userRole || n.noticeFor === "All User"
      );
      
      setNotices(filtered);
      setUnreadCount(filtered.filter((n: any) => !n.seen.includes(userId)).length);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const getNoticeTheme = (noticeFor: string) => {
    switch (noticeFor) {
      case "Student": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Teacher": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Driver": return "text-orange-600 bg-orange-50 border-orange-100";
      case "All User": return "text-purple-600 bg-purple-50 border-purple-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-slate-950 text-white py-2 overflow-hidden h-9 flex items-center border-b border-white/10">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAnnouncement}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400"
          >
            {announcements[currentAnnouncement]}
          </motion.p>
        </AnimatePresence>
      </div>

      <nav 
        className={`sticky top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
          ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3" 
          : "bg-white py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                <Image src={Logo} alt="GUB Logo" fill className="object-contain p-1.5" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">
                GUB<span className="text-primary">BUS</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-xl ${
                      active 
                      ? "text-primary bg-primary/5" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/schedule">
              <button 
                className="p-2.5 rounded-xl text-slate-500 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                title="Search Routes"
              >
                <Search size={20} />
              </button>
            </Link>

            {/* Notifications Side Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className={`p-2.5 rounded-xl transition-all duration-300 relative text-slate-500 hover:bg-primary/10 hover:text-primary`}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0 rounded-l-[3rem] border-none shadow-2xl bg-slate-50 overflow-hidden">
                <div className="p-8 bg-slate-950 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                  <SheetHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Megaphone size={20} className="text-primary" />
                      </div>
                      <SheetTitle className="text-2xl font-black text-white tracking-tight">Bulletin Board</SheetTitle>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      {unreadCount} New announcements for your profile
                    </p>
                  </SheetHeader>
                </div>

                <div className="p-6 h-[calc(100vh-140px)] overflow-y-auto">
                  <div className="space-y-4">
                    {notices.length > 0 ? (
                      notices.map((notice, index) => {
                        const isUnseen = !(notice.seen.includes((user as any)?._id));
                        const theme = getNoticeTheme(notice.noticeFor);
                        
                        return (
                          <motion.div
                            key={notice.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 rounded-[2rem] transition-all duration-300 border ${
                              isUnseen 
                              ? 'bg-white shadow-xl shadow-primary/5 border-primary/10 ring-1 ring-primary/5' 
                              : 'bg-white/50 border-slate-100'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${theme}`}>
                                {notice.noticeFor}
                              </span>
                              {isUnseen && (
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 leading-tight mb-2">{notice.subject}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                              {notice.description}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                                  <Calendar size={10} className="text-primary/50" />
                                  {new Date(notice.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                                  <Eye size={10} className="text-primary/50" />
                                  {notice.seen.length}
                                </div>
                              </div>
                              <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                           <Inbox className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">No announcements</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {isAuthenticated ? (
              <Profile />
            ) : (
              <Link href="/auth/login">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all duration-500 shadow-lg shadow-slate-900/10">
                  Sign In
                  <ChevronRight size={14} />
                </button>
              </Link>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default TopNavbar;
