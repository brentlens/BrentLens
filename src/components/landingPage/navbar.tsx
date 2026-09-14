/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

export default function Navbar({
  isPreLanding = true,
}: {
  isPreLanding?: boolean;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  //   useEffect(() => {
  //     const savedTheme = localStorage.getItem("brentlens-theme") as "dark" | "light";
  //     if (savedTheme) {
  //       setTheme(savedTheme);
  //       document.documentElement.setAttribute("data-theme", savedTheme);
  //     } else {
  //       document.documentElement.setAttribute("data-theme", "dark");
  //     }
  //   }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("brentlens-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMobileNav = (section: string) => { setMobileMenuOpen(false); scrollToSection(section); };

  return (
    <nav className="fixed left-0 right-0 top-0 z-[300] h-[70px] border-b border-bd bg-nav-bg px-5 backdrop-blur-xl transition-colors duration-300 md:px-10">
  {/* Navbar content */}
  <div className="flex h-full items-center">
    {/* Logo */}
    <div className="flex items-center">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/assets/landingPage/landing_logo.png"
          alt="BrentLens"
          id="nav-logo"
          className="block h-[50px] w-auto"
        />
      </Link>
    </div>

    {/* Desktop Navigation */}
    <div className="ml-10 hidden gap-[2px] md:flex">
      <button
        className="nl rounded-lg bg-none px-3.5 py-[7px] font-sans text-[13px] font-medium text-ink3 transition-all duration-140 hover:bg-pur/10 hover:text-pur2"
        onClick={() => scrollToSection("how")}
      >
        How it Works
      </button>

      <button
        className="nl rounded-lg bg-none px-3.5 py-[7px] font-sans text-[13px] font-medium text-ink3 transition-all duration-140 hover:bg-pur/10 hover:text-pur2"
        onClick={() => scrollToSection("industries")}
      >
        Industries
      </button>

      <button
        className="nl rounded-lg bg-none px-3.5 py-[7px] font-sans text-[13px] font-medium text-ink3 transition-all duration-140 hover:bg-pur/10 hover:text-pur2"
        onClick={() => scrollToSection("pricing")}
      >
        Pricing
      </button>

      <button
        className="nl rounded-lg bg-none px-3.5 py-[7px] font-sans text-[13px] font-medium text-ink3 transition-all duration-140 hover:bg-pur/10 hover:text-pur2"
        onClick={() => scrollToSection("faq")}
      >
        FAQ
      </button>
    </div>

    {/* Desktop Right Side */}
    <div className="ml-auto hidden items-center gap-2 md:flex">
      {!isPreLanding && (
        <>
          <div className="live-pill flex items-center gap-[6px] rounded-full border border-green/25 bg-green/10 px-3 py-[5px] font-sora text-[11px] font-bold tracking-wide text-green">
            <div className="live-dot h-[7px] w-[7px] flex-shrink-0 animate-live-pulse rounded-full bg-green" />
            Live
          </div>

          <button className="btn-login rounded-lg bg-none px-4 py-2 text-[13px] font-semibold text-ink3 transition-all duration-140 hover:bg-pur/10 hover:text-pur2">
            Login
          </button>
        </>
      )}

      <button
        onClick={() => {
          router.push("/onboarding");
        }}
        className="btn-started rounded-lg bg-gradient-to-br from-pur to-cyan px-[22px] py-2.5 text-[13px] font-bold text-white shadow-[0_3px_14px_rgba(124,58,237,0.35)] transition-all duration-160 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(124,58,237,0.45)]"
      >
        {isPreLanding ? "Reserve Founding Rates" : "Get Started"}
      </button>
    </div>

    {/* Mobile Hamburger Button */}
    <button
      type="button"
      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileMenuOpen}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2 md:hidden"
    >
      {mobileMenuOpen ? (
        /* X icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        /* Hamburger icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  </div>

  {/* Mobile Menu */}
  {mobileMenuOpen && (
    <div className="absolute left-0 right-0 top-[70px] border-b border-bd bg-nav-bg px-5 pb-5 pt-3 shadow-lg backdrop-blur-xl md:hidden">
      <div className="flex flex-col gap-1">
        <button
          onClick={() => handleMobileNav("how")}
          className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2"
        >
          How it Works
        </button>

        <button
          onClick={() => handleMobileNav("industries")}
          className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2"
        >
          Industries
        </button>

        <button
          onClick={() => handleMobileNav("pricing")}
          className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2"
        >
          Pricing
        </button>

        <button
          onClick={() => handleMobileNav("faq")}
          className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2"
        >
          FAQ
        </button>

        {/* Mobile divider */}
        <div className="my-2 h-px bg-bd" />

        {/* Mobile Login */}
        {!isPreLanding && (
          <button className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-ink3 transition-colors hover:bg-pur/10 hover:text-pur2">
            Login
          </button>
        )}

        {/* Mobile CTA */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            router.push("/onboarding");
          }}
          className="mt-2 w-full rounded-lg bg-gradient-to-br from-pur to-cyan px-5 py-3 text-center text-sm font-bold text-white shadow-[0_3px_14px_rgba(124,58,237,0.35)]"
        >
          {isPreLanding ? "Reserve Founding Rates" : "Get Started"}
        </button>
      </div>
    </div>
  )}
</nav>
  );
}