import React from "react";
import { Bell, Bus, LogOut, Search } from "lucide-react";
import Logo from "../../public/GUBLogo.svg";
import Image from "next/image";

const DashboardHader = () => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm h-[70px]">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="logo-container -ml-10">
          <Image
            src={Logo}
            alt="logo"
            width={100}
            height={50}
            className="w-48 h-12 -ml-5 lg:ml-0"
            priority
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Icon */}
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>

          {/* Notification Icon */}
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* Desktop Profile Menu - Visible on lg+ */}
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-border">
            <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHader;
