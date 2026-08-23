/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth states (Defaulting to false until the cookie check runs)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("test@gmail.com");

  // 1. Check for auth-token in cookies on mount
 useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const res = await fetch("/api/auth/loggedStatus");
      const data = await res.json();

      setIsLoggedIn(data.loggedInStatus);
	  setUserEmail(data.user.email);
    } catch {
      setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
}, []);

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'About Us', href: '/about' },
  ];
  const [openDonate, setOpenDonate] = useState(false);
  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-8 py-4 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-zinc-800' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* <Link href="/" className="flex items-center gap-2">
            <img src="/assets/header/logo.png" alt="TruthPin Logo" className="w-36" />
          </Link> */}
		  <h1 className="test-2xl font-bold">Oil Pulse</h1>
		  

          {/* Desktop Links & Actions */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-md font-medium text-white hover:text-[#C64436] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {/* Profile Action Endpoint */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-1 text-white hover:text-zinc-300 transition-colors focus:outline-none"
                aria-label="User profile options"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                
                {isLoggedIn && (
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                )}
              </button>

              {/* Dropdown Menu */}
              {isLoggedIn && isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#121212] border border-zinc-800 rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <p className="text-xs text-zinc-500 font-medium">Signed in as</p>
                    <p className="text-sm text-zinc-200 truncate font-medium mt-0.5">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#C64436] hover:bg-zinc-900/60 font-medium transition-colors flex items-center gap-2 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12l-3-3m3 3l-3 3m3-3H9" />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Icon */}
          <button 
            className="md:hidden text-white z-50 p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sliding Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm z-50 bg-[#0a0a0a] border-l border-zinc-800 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col p-6 pt-16 gap-4">
          <button 
            className="absolute top-6 right-8 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-xl font-medium text-white hover:text-[#C64436] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/contact" 
            className="bg-[#C64436] text-center hover:bg-[#b03a2e] text-white px-8 py-3 rounded-md text-lg font-medium transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Donate
          </Link>

          <hr className="border-zinc-800 my-2" />

          {/* Mobile Identity State Display */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-800/60">
                <p className="text-xs text-zinc-500 font-medium">Logged in account</p>
                <p className="text-sm text-zinc-300 font-medium truncate mt-0.5">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full text-center bg-zinc-900 border border-zinc-800 text-zinc-300 py-3 rounded-md font-medium text-md transition-all hover:bg-zinc-800"
              >
                Log Out
              </button>
            </div>
          ): (
			<button
			onClick={() => {
				router.push("/login");
				setIsMobileMenuOpen(false);
			}}
			className="w-full bg-[#C64436] text-white py-3 rounded-md font-medium hover:bg-[#b03a2e] transition-colors"
			>
			Login
		   </button>
  )}
        </div>
      </div>
    </>
  );
};

export default Navbar;