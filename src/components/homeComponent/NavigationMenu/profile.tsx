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
import { UserTypes } from "@/lib/userType";
import {
  BadgeDollarSign,
  CircleUser,
  Cog,
  HandCoins,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Profile = () => {
  const { user, logout } = useAuth();
  const [LoginUser, setLoginUser] = useState<any>(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:block">
        <CircleUser
          size={30}
          strokeWidth={1}
          className="stroke-accent-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-md border shadow-lg">
        <DropdownMenuLabel className="justify-center">
          <div className="justify-center items-center text-center">
            <Image
              src={LoginUser?.avatar_url}
              alt="User image"
              width={50}
              height={50}
              className="mx-auto"
            />

            <h3>User Name:{LoginUser?.username}</h3>
            <h3 className="text-slate-500/50">User Id: {LoginUser?.uId}</h3>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem className="group group-hover:text-gray-100">
          <LayoutDashboard className="text-black group-hover:text-gray-100" />
          <Link href={"/dashboard"}>
            <span className="group-hover:text-gray-100">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="group group-hover:text-gray-100 ">
          <BadgeDollarSign className="text-black group-hover:text-gray-100" />{" "}
          <span className="group-hover:text-gray-100">Transation</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem className="group group-hover:text-gray-100">
          <LogOut className="text-red-600 " />{" "}
          <span className="group-hover:text-gray-100" onClick={logout}>
            Log Out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
