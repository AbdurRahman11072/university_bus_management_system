import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../public/GUBLogo.svg";
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
    path: "/contact-us",
  },
  {
    name: "Notice",
    path: "/notice",
  },
];

const TopNavbar = () => {
  return (
    <nav className=" w-full flex bg-white justify-between items-center p-4 border-b-[1px] border-slate-500/20 z-50 ">
      <div className="flex gap-5 justify-center items-center">
        <div className="logo-container">
          <Image
            src={Logo}
            alt="logo"
            width={100}
            height={50}
            className="w-48 h-12"
          />
        </div>
        {/* desktop search field  */}
        <InputGroup className="hidden lg:block rounded-3xl pl-2">
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
          className="stroke-accent-foreground block lg:hidden"
        />

        {/* menu items  */}
        <ul className="gap-4 hidden font-sans lg:flex ">
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
        <Link href={`/auth/login`}>
          <button
            className="px-1 py-1.5 rounded-sm  w-18 h-9
        bg-accent hover:bg-primary-foreground hover:text-black hover:border-2 hover:border-accent text-sm text-primary-foreground font-bold  "
          >
            Log in
          </button>
        </Link>

        {/* USER PROFILE DROP DOWN MENU  */}
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
            <DropdownMenuItem className="group group-hover:text-gray-100">
              <LayoutDashboard className="text-black group-hover:text-gray-100" />
              <span className="group-hover:text-gray-100">Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group group-hover:text-gray-100">
              <HandCoins className="text-black group-hover:text-gray-100" />{" "}
              <span className="group-hover:text-gray-100">Reward</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group group-hover:text-gray-100 ">
              <BadgeDollarSign className="text-black group-hover:text-gray-100" />{" "}
              <span className="group-hover:text-gray-100">Transation</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group group-hover:text-gray-100">
              <Cog className="text-black group-hover:text-gray-100" />{" "}
              <span className="group-hover:text-gray-100">Setting</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem className="group group-hover:text-gray-100">
              <LogOut className="text-red-600 " />{" "}
              <span className="group-hover:text-gray-100">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopNavbar;
