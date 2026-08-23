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

  return (
    <nav className="fixed top-0 left-0 right-0 z-[300] h-[70px] flex items-center px-5 md:px-10 border-b border-bd backdrop-blur-xl bg-nav-bg  transition-colors duration-300">
      <div className="flex items-center">
        {/* Transparent Base64 Inline Logo to ensure identical output matches BrentLens Final Landing Page .html */}
        <Link href="/" className="flex items-center gap-2">
           <img 
			src="/assets/landingPage/landing_logo.png"
			alt="BrentLens" 
			id="nav-logo" 
			className="h-[50px] w-auto block"
			/>
        </Link>
		
      </div>
      <div className="nlinks hidden md:flex gap-[2px] ml-10">
        <button className="nl font-sans text-[13px] font-medium px-3.5 py-[7px] rounded-lg text-ink3 transition-all duration-140 bg-none hover:bg-pur/10 hover:text-pur2" onClick={() => scrollToSection("how")}>How it Works</button>
        <button className="nl font-sans text-[13px] font-medium px-3.5 py-[7px] rounded-lg text-ink3 transition-all duration-140 bg-none hover:bg-pur/10 hover:text-pur2" onClick={() => scrollToSection("industries")}>Industries</button>
        <button className="nl font-sans text-[13px] font-medium px-3.5 py-[7px] rounded-lg text-ink3 transition-all duration-140 bg-none hover:bg-pur/10 hover:text-pur2" onClick={() => scrollToSection("pricing")}>Pricing</button>
        <button className="nl font-sans text-[13px] font-medium px-3.5 py-[7px] rounded-lg text-ink3 transition-all duration-140 bg-none hover:bg-pur/10 hover:text-pur2" onClick={() => scrollToSection("faq")}>FAQ</button>
      </div>
      <div className="nend ml-auto flex items-center gap-2">
		{!isPreLanding && (
			<>
				<div className="live-pill flex items-center gap-[6px] px-3 py-[5px] rounded-full bg-green/10 border border-green/25 font-sora text-[11px] font-bold text-green tracking-wide">
				<div className="live-dot w-[7px] h-[7px] rounded-full bg-green flex-shrink-0 animate-live-pulse" />
				Live
				</div>

				{/* <button
				className="theme-toggle w-9 h-9 rounded-[9px] bg-toggleBg flex items-center justify-center text-toggleIc transition-all duration-160 flex-shrink-0 hover:bg-pur/10 hover:text-pur2"
				onClick={toggleTheme}
				title="Toggle theme"
				>
				{theme === "dark" ? "D" : "L"}
				</button> */}

				<button className="btn-login text-[13px] font-semibold text-ink3 px-4 py-2 rounded-lg bg-none transition-all duration-140 hover:text-pur2 hover:bg-pur/10">
				Login
				</button>
			</>
		)}
        <button
			onClick={() => {
				router.push("/onboarding");
			}}
			className="btn-started text-[13px] font-bold px.5.5 py-2.5 px-[22px] rounded-lg bg-gradient-to-br from-pur to-cyan text-white shadow-[0_3px_14px_rgba(124,58,237,0.35)] transition-all duration-160 hover:translate-y-[-1px] hover:shadow-[0_6px_22px_rgba(124,58,237,0.45)]"
			>
			{isPreLanding ? "Reserve Founding Rates" : "Get Started"}
		</button>
      </div>
    </nav>
  );
}