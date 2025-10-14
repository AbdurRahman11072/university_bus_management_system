import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CircleUser,
  LayoutDashboard,
  HandCoins,
  BadgeDollarSign,
  Cog,
  LogOut,
  SearchIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const menu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Schedule",
    path: "/schedule",
  },
  {
    name: "Contact Us",
    path: "/home",
  },
  {
    name: "Notice",
    path: "/notice",
  },
];

const TopNavbar = () => {
  return (
    <nav className=" w-full flex justify-between items-center p-4 border-b-[1px] border-slate-500/20 z-50 ">
      <div className="flex gap-5 justify-center items-center">
        <h1 className="text-xl font-serif">Comico</h1>
        {/* desktop search field  */}
        <InputGroup className="hidden md:block rounded-3xl pl-2">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon></InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton className="absolute top-1.5 right-2">
              <SearchIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className=" flex  items-center gap-3 text-xl">
        {/* SERACH FIELD  */}
        <SearchIcon
          strokeWidth="2px"
          className="stroke-accent block md:hidden"
        />

        {/* menu items  */}
        <ul className="gap-4 hidden font-sans md:flex ">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className=" flex justify-center  items-center gap-1 text-sm font-semibold"
            >
              {item.name}
            </Link>
          ))}
        </ul>

        {/* LOGIN BUTTON  */}
        <button
          className="px-1 py-1.5 rounded-sm  w-18 h-9
        bg-accent hover:bg-primary-foreground hover:text-black hover:border-2 hover:border-accent text-sm text-primary-foreground font-bold  "
        >
          Log in
        </button>

        {/* USER PROFILE DROP DOWN MENU  */}
        <DropdownMenu>
          <DropdownMenuTrigger className=" md:block">
            <CircleUser size={30} strokeWidth={1} className="stroke-accent" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="text-md border shadow-lg">
            <DropdownMenuLabel className="justify-center">
              <div className=" justify-center items-center text-center">
                <Image
                  src="https://imgs.search.brave.com/i3nbvjda_fdWRr5oZ7OKctN61jXv332ZzEL3kPFijOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi91c2VyLWlj/b24tc3ZnLWRvd25s/b2FkLXBuZy05NzUz/MTQ4LnBuZz9mPXdl/YnAmdz0xMjg"
                  alt="User image"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <h3>Md. Abdur Rahmna</h3>
                <h3>rjrahman019@gmail.com</h3>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem>
              <LayoutDashboard color="white" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HandCoins color="white" /> Reward
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BadgeDollarSign color="white" /> Transaction
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cog color="white" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem>
              <LogOut color="red" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopNavbar;
