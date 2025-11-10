"use client";

import React, { useState, useEffect, useCallback } from "react";

interface AutoTextScrollingProps {
  texts: string[];
  speed?: number;
  pauseBetween?: number;
  className?: string;
}

const AutoTextScrolling: React.FC<AutoTextScrollingProps> = ({
  texts,
  speed = 40,
  pauseBetween = 2000,
  className = "",
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentDisplay, setCurrentDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const typeText = useCallback(() => {
    const currentText = texts[currentTextIndex];

    if (!isDeleting && !isPaused) {
      // Typing phase
      if (currentDisplay.length < currentText.length) {
        setTimeout(() => {
          setCurrentDisplay(
            currentText.substring(0, currentDisplay.length + 1)
          );
        }, speed);
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseBetween);
      }
    } else if (isDeleting && !isPaused) {
      // Deleting phase
      if (currentDisplay.length > 0) {
        setTimeout(() => {
          setCurrentDisplay(
            currentDisplay.substring(0, currentDisplay.length - 1)
          );
        }, speed / 2);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [
    currentDisplay,
    currentTextIndex,
    isDeleting,
    isPaused,
    texts,
    speed,
    pauseBetween,
  ]);

  useEffect(() => {
    typeText();
  }, [typeText]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
        <span className="text-sm font-medium text-gray-700">
          {currentDisplay}
          <span className="ml-1 animate-pulse">|</span>
        </span>
      </div>
    </div>
  );
};

export default AutoTextScrolling;
