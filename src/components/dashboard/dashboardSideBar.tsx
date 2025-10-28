"use client";

import {
  BarChart,
  BellPlus,
  BookCopy,
  Bus,
  Calendar,
  FileText,
  Home,
  Icon,
  LogOut,
  Map,
  Navigation,
  PiIcon,
  Settings,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, link: "/dashboard" },
  { id: "user", label: "User", icon: User, link: "/dashboard/user" },
  { id: "survey", label: "Survey", icon: BookCopy, link: "/dashboard/survey" },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    link: "/dashboard/schedule",
  },
  {
    id: "contact",
    label: "Contact",
    icon: FileText,
    link: "/dashboard/contact",
  },
  {
    id: "manage-buses",
    label: "Manage Buses",
    icon: Bus,
    link: "/dashboard/manage-buses",
  },
  {
    id: "manage-drivers",
    label: "Manage Drivers",
    icon: UserCheck,
    link: "/dashboard/manage-drivers",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Settings,
    link: "/dashboard/maintenance",
  },
  {
    id: "notices",
    label: "Notices",
    icon: BellPlus,
    link: "/dashboard/notices",
  },
  {
    id: "gps-tracking",
    label: "GPS Tracking",
    icon: Navigation,
    link: "/dashboard/gps-tracking",
  },
];

const DashboardSideBar = () => {
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(link);
  };

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-border h-[calc(100vh-70px)]">
      <nav className="flex-1 px-4 pt-2 pb-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.link);
          return (
            <Link href={item.link} key={item.id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 mt-1 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            pathname === "/dashboard/profile"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-secondary/50"
          }`}
        >
          <Users className="w-5 h-5" />
          <Link href="/dashboard/profile" className="font-medium">
            Profile
          </Link>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg  hover:bg-accent/30 transition-all mt-2">
          <Home className="w-5 h-5" />
          <span className="font-medium">Go Home</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all mt-2">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
