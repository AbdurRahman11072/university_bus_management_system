import React from "react";

import Link from "next/link";

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

const BottomNavbar = () => {
  return (
    <div className="absolute bottom-0 border-t-[1px] border-gray-600/20 ">
      bottomNavbar
    </div>
  );
};

export default BottomNavbar;
