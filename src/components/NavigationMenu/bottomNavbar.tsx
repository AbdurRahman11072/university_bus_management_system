import React from "react";

import Link from "next/link";
import {
  History,
  HomeIcon,
  icons,
  MessageSquare,
  PhoneOutgoing,
  User2Icon,
} from "lucide-react";

const menu = [
  {
    name: "Home",
    path: "/",
    icons: HomeIcon,
  },
  {
    name: "Schedule",
    path: "/schedule",
    icons: History,
  },
  {
    name: "Contact Us",
    path: "/contact-us",
    icons: PhoneOutgoing,
  },
  {
    name: "Notice",
    path: "/notice",
    icons: MessageSquare,
  },
  {
    name: "Profile",
    path: "/profile",
    icons: User2Icon,
  },
];

const BottomNavbar = () => {
  return (
    <div className="fixed w-full  bottom-0 border-t-[1px] shadow-2xl flex md:hidden gap-4 justify-evenly px-4 py-4 items-center bg-white z-50">
      {menu.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          className="text-sm font-semibold flex flex-col justify-center items-center gap-1"
        >
          <item.icons />
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default BottomNavbar;
