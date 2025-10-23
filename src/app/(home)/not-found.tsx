import Image from "next/image";
import React from "react";
import ErrorSvg from "../../public/images/404.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const notfound = () => {
  return (
    <div className="w-full h-[700px] relative ">
      {/* Container with defined height */}
      <Image
        src="/images/404.png"
        alt="404 image"
        layout="fill"
        className="object-contain"
      />
      <Link href={`/`} className="absolute top-[80%] left-[45%]">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default notfound;
