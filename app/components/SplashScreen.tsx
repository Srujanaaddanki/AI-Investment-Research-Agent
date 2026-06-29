"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smoothly fade in shortly after mounting
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Start fading out after 2.3 seconds (fade-in completed + hold time)
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 2300);

    // Unmount and show dashboard once fade-out completes (after total ~3.3 seconds)
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-1000 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0b1329_0%,#020617_100%)]"></div>

      {/* Floating Low-Opacity Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[130px] animate-pulse duration-[8000ms] ease-in-out"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[140px] animate-pulse duration-[12000ms] ease-in-out"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto flex flex-col justify-center items-center">
        {/* Main Quote (Exactly two lines) */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-relaxed select-none">
          The best investment<br />
          is an informed decision.
        </h1>

        {/* Tagline */}
        <p className="mt-5 text-base md:text-lg italic font-medium text-blue-500 tracking-wide select-none">
          Where Intelligence Meets Investing.
        </p>
      </div>
    </div>
  );
}
