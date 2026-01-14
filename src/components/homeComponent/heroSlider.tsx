"use client";

import bg1 from "@/assets/bg-1.jpg";
import bg2 from "@/assets/bg-2.jpg";
import bg3 from "@/assets/bg-3.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

const slides = [
  {
    id: 1,
    image: bg1,
    title: "Safe & Reliable Bus Services For GUB Students",
    subtitle: "Book your ride effortlessly & travel with ease",
    buttonText: "Book Now",
    link: "/booktrip/book-bus",
  },
  {
    id: 2,
    image: bg2,
    title: "Comfortable Journey Every Time",
    subtitle: "Experience premium comfort on every ride",
    buttonText: "Explore Routes",
    link: "/schedule",
  },
  {
    id: 3,
    image: bg3,
    title: "Know Your Bus, Save Your Time",
    subtitle: "We value your time and commitment",
    buttonText: "See Routes",
    link: "/auth/login",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  return (
    <div className="container mx-auto relative w-full h-[90vh] overflow-hidden mt-5">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute rounded-2xl overflow-hidden inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover "
              priority={index === 0}
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 text-balance">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 text-balance">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <Link href={`${slide.link}`}>
                  <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent/60 text-white font-semibold rounded-full transition-colors duration-300 text-sm sm:text-base">
                    {slide.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-white w-8 h-2.5 sm:w-10 sm:h-3"
                : "bg-white/50 hover:bg-white/75 w-2.5 h-2.5 sm:w-3 sm:h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous/Next Buttons */}
      <button
        onClick={() =>
          goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-colors duration-300"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-colors duration-300"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
