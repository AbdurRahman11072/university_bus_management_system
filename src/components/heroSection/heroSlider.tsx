"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const sliderContent = [
  {
    title: "Safe & Reliable Bus Services For GUB Students",
    subTitle: "Book your ride effortlessly & travle with ease",
    slideImage:
      "https://imgs.search.brave.com/vMMswPfwWypfsyOr6fuXuz_fHtO5XjzF8fYq_FKf610/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zY2Mu/c3R1ZGVudGFmZmFp/cnMubWlhbWkuZWR1/L19hc3NldHMvaW1h/Z2VzL3VuaXZlcnNp/dHktZ3JlZW4taW1h/Z2VzL3VuaXZlcnNp/dHlfZ3JlZW5fMTI0/MHg1NTAuanBn",
    buttonLink: "/schedule",
  },
  {
    title: "Now getting a bus Ride is easy. Just Book your ride",
    subTitle: "Book your ride effortlessly & travle with ease",
    slideImage:
      "https://imgs.search.brave.com/vMMswPfwWypfsyOr6fuXuz_fHtO5XjzF8fYq_FKf610/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zY2Mu/c3R1ZGVudGFmZmFp/cnMubWlhbWkuZWR1/L19hc3NldHMvaW1h/Z2VzL3VuaXZlcnNp/dHktZ3JlZW4taW1h/Z2VzL3VuaXZlcnNp/dHlfZ3JlZW5fMTI0/MHg1NTAuanBn",
    buttonLink: "/schedule",
  },
];
const HeroSlider = () => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 1,
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full "
    >
      <CarouselContent className="">
        {sliderContent.map((item) => (
          <CarouselItem key={item.title} className=" ba">
            <div className="relative h-[35vh] sm:h-[40vh] md:h-[40vh] lg:h-[60vh] xl:h-[70vh] overflow-hidden rounded-lg">
              <Image
                src={item.slideImage}
                alt={`${item.title} is loading`}
                fill
                className="object-cover md:group-hover:scale-110 transition-all duration-200 rounded-lg"
              />
            </div>
            <div className="absolute w-full h-full top-0 flex justify-center items-center ">
              <div className="text-center bg-black/40 w-[80%] md:w-[60%]  rounded-lg p-5 space-y-3">
                <h1 className="text-xl lg:text-4xl text-white font-extrabold font-sans">
                  {item.title}
                </h1>
                <h1 className="text-lg text-white/70 font-sans">
                  {item.subTitle}
                </h1>
                <button className="px-1 py-1.5 rounded-sm  w-24 h-9 bg-green-500 hover:bg-green-600/80 text-sm text-primary-foreground font-bold  ">
                  Book Now
                </button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroSlider;
