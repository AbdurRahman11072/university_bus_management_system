import Image from "next/image";
import React from "react";
import ErrorSvg from "../../public/images/404.svg";
const notfound = () => {
  return (
    <div className="w-full h-screen relative ">
      {/* Container with defined height */}
      <ErrorSvg />
    </div>
  );
};

export default notfound;
