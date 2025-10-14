import React from "react";

interface TitelDetails {
  title: string;
  subtitle?: string;
}

const Title = (TitelDetails: TitelDetails) => {
  return (
    <div className="w-full space-y-2 text-center flex flex-col justify-center items-center">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold font-sans">
        {TitelDetails.title}
      </h1>
      <h1 className="text-xs md:text-lg text-black/50 ">
        {TitelDetails.subtitle}
      </h1>
      <div className="w-[30%] lg:w-[20%] h-1 bg-accent "></div>
    </div>
  );
};

export default Title;
