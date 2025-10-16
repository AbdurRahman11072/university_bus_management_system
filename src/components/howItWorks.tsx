import React from "react";
import Title from "./ui/title";
import { Bus, BusFront, BusIcon, Earth, Hourglass, LogIn } from "lucide-react";

const Details = [
  {
    icons: LogIn,
    title: "Register",
    subtitles: "Your safety is our top prioty",
  },
  {
    icons: BusFront,
    title: "Book a Ride",
    subtitles: "Your safety is our top prioty",
  },
  {
    icons: BusIcon,
    title: "Enjoy the Ride",
    subtitles: "Your safety is our top prioty",
  },
];

const HowItWorks = () => {
  return (
    <section className="space-y-5">
      <Title title="How it work?" />
      <div className="flex flex-wrap gap-6 justify-center">
        {Details.map((item) => (
          <div
            key={item.title}
            className="flex gap-8 w-full  lg:w-[47%] xl:w-[32%]  p-5  border shadow-lg hover:shadow-[0_8px_16px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-lg"
          >
            <item.icons size={30} className="stroke-accent" />
            <div className="space-y-4">
              <h1 className="text-xl font-bold">{item.title}</h1>
              <h1 className="text-lg text-foreground">{item.subtitles}</h1>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
