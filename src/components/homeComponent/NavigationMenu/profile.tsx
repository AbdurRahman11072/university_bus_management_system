"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  BadgeDollarSign,
  CircleUser,
  Cog,
  HandCoins,
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  CreditCard,
  Shield,
  Bell,
  HelpCircle,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Profile = () => {
  const { user, logout } = useAuth();
  const [LoginUser, setLoginUser] = useState<any>(user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      Admin: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Admin",
      },
      Driver: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Driver",
      },
      Passenger: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Passenger",
      },
      Moderator: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Moderator",
      },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: role,
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getInitials = (username: string) => {
    return (
      username
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:flex items-center justify-center">
        <div className="relative w-10 h-10 rounded-full">
          {LoginUser?.avatar_url ? (
            <Image
              src={LoginUser.avatar_url}
              alt="User profile"
              fill
              className="rounded-full border-2 border-accent hover:border-accent/80 transition-all duration-200 cursor-pointer object-contain"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border-2 border-accent hover:border-accent/80 transition-all duration-200 cursor-pointer">
              <span className="text-white font-semibold text-sm">
                {getInitials(LoginUser?.username || "")}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 border shadow-xl rounded-xl bg-white/95 backdrop-blur-sm"
        align="end"
      >
        {/* User Profile Header */}
        <DropdownMenuLabel className="p-4 hover:bg-transparent">
          <div className="flex items-center space-x-3">
            {LoginUser?.avatar_url ? (
              <div className="relative w-10 h-10 rounded-full">
                <Image
                  src={LoginUser.avatar_url}
                  alt="User profile"
                  fill
                  className="rounded-full border-2 border-accent hover:border-accent/80 transition-all duration-200 cursor-pointer object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {getInitials(LoginUser?.username || "")}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {LoginUser?.username || "User"}
                </h3>
                {LoginUser?.roles && getRoleBadge(LoginUser.roles)}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {LoginUser?.email || "No email provided"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ID: {LoginUser?.uId || "N/A"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Quick Actions */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Link href="/profile">
              <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-accent hover:text-white transition-all duration-200 cursor-pointer group">
                <User className="h-4 w-4 mb-1 text-gray-600 group-hover:text-white" />
                <span className="text-xs font-medium">Profile</span>
              </div>
            </Link>

            <Link href="/settings">
              <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-accent hover:text-white transition-all duration-200 cursor-pointer group">
                <Settings className="h-4 w-4 mb-1 text-gray-600 group-hover:text-white" />
                <span className="text-xs font-medium">Settings</span>
              </div>
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Main Menu Items */}
        <div className="p-1">
          {LoginUser?.roles === "Student" && (
            <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-all duration-200 group">
              <Link href="/transactions" className="flex items-center w-full">
                <CreditCard className="h-4 w-4 mr-3 text-gray-600 group-hover:text-white" />
                <span className="font-medium">Transactions</span>
              </Link>
            </DropdownMenuItem>
          )}
          {LoginUser?.roles === "Teacher" && (
            <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-all duration-200 group">
              <Link href="/transactions" className="flex items-center w-full">
                <CreditCard className="h-4 w-4 mr-3 text-gray-600 group-hover:text-white" />
                <span className="font-medium">Transactions</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Admin Dashboard */}
          {LoginUser?.roles === "Admin" && (
            <Link href="/dashboard">
              <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-all duration-200 group">
                <Shield className="h-4 w-4 mr-3 text-gray-600 group-hover:text-white" />
                <span className="font-medium">Admin Dashboard</span>
                <span className="ml-auto bg-red-100 text-red-800 text-xs rounded-full px-2 py-1">
                  Admin
                </span>
              </DropdownMenuItem>
            </Link>
          )}

          {/* Driver Specific Menu */}
        </div>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Support & Settings */}
        <div className="p-1">
          <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-all duration-200 group">
            <Link href="/help" className="flex items-center w-full">
              <HelpCircle className="h-4 w-4 mr-3 text-gray-600 group-hover:text-white" />
              <span className="font-medium">Help & Support</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-200" />

        {/* Logout */}
        <DropdownMenuItem
          className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3 text-red-600" />
          <span className="font-medium text-red-600">Log Out</span>
        </DropdownMenuItem>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>v1.0.0</span>
            <span>© 2025 GUB</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
