"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  BellPlus,
  BookCopy,
  Bus,
  BusIcon,
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

const menuItems = [
  { id: "admin", label: "Dashboard", icon: Home, link: "/admin" },
  { id: "user", label: "User", icon: User, link: "/admin/user" },
  { id: "survey", label: "Survey", icon: BookCopy, link: "/admin/survey" },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    link: "/admin/schedule",
  },
  {
    id: "contact",
    label: "Contact",
    icon: FileText,
    link: "/admin/contact",
  },
  {
    id: "manage-buses",
    label: "Manage Buses",
    icon: Bus,
    link: "/admin/manage-buses",
  },
  {
    id: "manage-drivers",
    label: "Manage Drivers",
    icon: UserCheck,
    link: "/admin/manage-drivers",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Settings,
    link: "/admin/maintenance",
  },
  {
    id: "booktrip",
    label: "Trip Request",
    icon: BusIcon,
    link: "/admin/book-trip",
  },
  {
    id: "notices",
    label: "Notices",
    icon: BellPlus,
    link: "/admin/notices",
  },
  {
    id: "transaction",
    label: "All Transaction",
    icon: BellPlus,
    link: "/admin/transaction",
  },
];

const DashboardSideBar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/admin") {
      return pathname === "/admin";
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
            pathname === "/admin/profile"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-secondary/50"
          }`}
        >
          <Users className="w-5 h-5" />
          <Link href="/admin/profile" className="font-medium">
            Profile
          </Link>
        </button>
        <Link href={"/"}>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg  hover:bg-accent/30 transition-all mt-2">
            <Home className="w-5 h-5" />
            <span className="font-medium">Go Home</span>
          </button>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all mt-2"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
