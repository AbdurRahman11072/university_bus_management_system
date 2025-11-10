"use client";

import React from "react";

interface TextMarqueeProps {
  texts: string[];
  speed?: number;
  className?: string;
}

const TextMarquee: React.FC<TextMarqueeProps> = ({
  texts,
  speed = 20,
  className = "",
}) => {
  const marqueeText = texts.join(" • ");

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span className="text-sm font-medium text-gray-600 mx-4">
          {marqueeText}
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TextMarquee;
