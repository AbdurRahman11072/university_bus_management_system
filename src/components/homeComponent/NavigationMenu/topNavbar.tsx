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
  Inbox,
  Calendar,
  Eye,
  ArrowRight,
  Circle
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
import { Badge } from "@/components/ui/badge";

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

  return (
    <>
      {/* Announcement Bar - Standard Primary Theme */}
      <div className="bg-primary text-primary-foreground py-2 h-9 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAnnouncement}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full text-center text-[10px] font-bold uppercase tracking-widest"
          >
            {announcements[currentAnnouncement]}
          </motion.p>
        </AnimatePresence>
      </div>

      <nav 
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3" 
          : "bg-background border-b py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                <Image src={Logo} alt="GUB Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                GUB<span className="text-primary font-black">BUS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                      active 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/schedule">
              <button 
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Search"
              >
                <Search size={18} />
              </button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className={`p-2 rounded-md transition-colors relative text-muted-foreground hover:text-foreground hover:bg-muted`}
                  title="Notices"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-6 border-b text-left">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold">Notices</SheetTitle>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">
                        {unreadCount} NEW
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Official university bus announcements</p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {notices.length > 0 ? (
                    notices.map((notice, index) => {
                      const isUnseen = !(notice.seen.includes((user as any)?._id));
                      return (
                        <div
                          key={notice.id}
                          className={`group p-4 rounded-lg border transition-all hover:bg-muted/50 ${
                            isUnseen ? 'border-primary/20 bg-primary/5' : 'bg-card'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className={`text-sm font-bold leading-snug ${isUnseen ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notice.subject}
                            </h4>
                            {isUnseen && <Circle size={8} className="fill-primary text-primary shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {notice.description}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(notice.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={10} />
                                {notice.seen.length} views
                              </span>
                            </div>
                            <Badge variant="outline" className="text-[9px] font-bold px-1.5 h-4">
                              {notice.noticeFor}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
                      <Inbox size={32} className="mb-2" />
                      <p className="text-xs font-medium">No notices available</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-muted/20">
                  <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-wider">
                    Powered by GUB Bus Management System
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            {isAuthenticated ? (
              <Profile />
            ) : (
              <Link href="/auth/login">
                <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-md transition-colors">
                  Login
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
