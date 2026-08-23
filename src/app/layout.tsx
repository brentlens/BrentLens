import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "BrentLens — Fuel Cost Intelligence",
  description: "Fuel Cost Intelligence Landing Page converted with Tailwind v4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Defaulting strictly to light theme configuration as requested
    <html lang="en" data-theme="light" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased">
        {/* Background glow configuration */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-0 data-[theme=dark]:opacity-100 transition-opacity duration-300">
          <div className="absolute rounded-full filter blur-[140px] w-[900px] h-[900px] bg-[#7C3AED]/10 -top-[300px] -left-[300px]" />
          <div className="absolute rounded-full filter blur-[140px] w-[700px] h-[700px] bg-[#06B6D4]/5 bottom-0 -right-[250px]" />
          <div className="absolute rounded-full filter blur-[140px] w-[500px] h-[500px] bg-[#4F46E5]/5 top-[40%] left-[30%]" />
        </div>
        {children}
      </body>
    </html>
  );
}