"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import bg1 from "@/assets/bg-1.jpg";
import bg2 from "@/assets/gub-bg2.jpg";
import bg3 from "@/assets/bg-3.jpg";
import bg4 from "@/assets/bg-4.jpg";

const Slider = () => {
  const sliderImages = [bg1, bg2, bg3, bg4];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-[90%] h-[100vh] mx-auto overflow-hidden rounded-lg">
      {sliderImages.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1500 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Bus Service ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 bg-opacity-50 p-6 rounded text-center z-20">
        <h1 className="text-5xl font-extrabold text-white">
          Safe & Reliable Bus Service for GUB Students
        </h1>
        <p className="mt-4 text-lg text-white">
          Book your ride effortlessly and travel with ease.
        </p>
        <Link
          href="/book-now"
          className="mt-6 inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Book a Ride
        </Link>
      </div>
    </section>
  );
};

export default Slider;
