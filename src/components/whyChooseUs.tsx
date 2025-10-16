import React from "react";
import Title from "./ui/title";
import { Bus, Earth, Hourglass } from "lucide-react";

const Details = [
  {
    icons: Bus,
    title: "Safe & Secure",
    subtitles: "Your safety is our top prioty",
  },
  {
    icons: Hourglass,
    title: "One Time Service",
    subtitles: "Your safety is our top prioty",
  },
  {
    icons: Earth,
    title: "Wide Coverage",
    subtitles: "Your safety is our top prioty",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="space-y-5">
      <Title title="Why Choose Us?" />
      <div className="flex flex-wrap gap-6 justify-center">
        {Details.map((item) => (
          <div
            key={item.title}
            className="flex gap-8 w-full sm:w-[70%]  lg:w-[47%] xl:w-[32%]  p-5  border shadow-lg hover:shadow-[0_8px_16px_-5px_rgba(0,0,0,0.1)] transition-all duration-300  rounded-lg"
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

export default WhyChooseUs;
