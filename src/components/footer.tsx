"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="p-[48px_40px_32px] border-t border-[var(--bd)] bg-[var(--bg2)] transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4 ">
        <div className="inline-flex items-center">
          <img 
            src="/assets/landingPage/landing_logo.png"
		    alt="BrentLens" 
            id="nav-logo" 
            className="h-11 w-auto block"
          />
        </div>
        <div className="foot-note text-[12px] text-ink3">
          © {new Date().getFullYear()} BrentLens. All rights reserved.
        </div>
        <div className="foot-links flex gap-[22px]">
          <a className="text-[12px] text-ink3 transition-colors duration-140 hover:text-pur2" href="#privacy">Privacy Policy</a>
          <a className="text-[12px] text-ink3 transition-colors duration-140 hover:text-pur2" href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}