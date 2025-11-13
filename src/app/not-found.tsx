"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary rounded-full blur-lg" />
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-accent rounded-full blur-md" />
      </div>

      <div
        className={`max-w-2xl text-center p-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 404 Graphic */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <Image
              src="/images/404.png"
              alt="404 - Not Found"
              width={380}
              height={280}
              className="mx-auto"
              priority
            />
            {/* Floating animation */}
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-lg animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Page not found
          </h1>

          <div className="space-y-2">
            <p className="text-lg text-muted-foreground leading-relaxed">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              Error 404 - Page not found
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 min-w-[140px]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Go to Home
            </span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 active:scale-95 min-w-[140px]"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { href: "/docs", label: "Documentation" },
              { href: "/blog", label: "Blog" },
              { href: "/support", label: "Support" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NotFound;
