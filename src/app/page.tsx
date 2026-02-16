"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent">

      {/* HEADER - Minimal & Premium */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between p-8 z-50 pointer-events-none">
        <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-white/90 antialiased drop-shadow-sm">
          Novembre
        </h1>
      </header>

      {/* HERO CONTENT */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl">

        {/* Subtle decorative element above text */}
        <div className="mb-8 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] animate-pulse">
          <Sparkles className="w-5 h-5 text-[#E0AAFF]" />
        </div>

        {/* Sophisticated Type - No excessive gradients causing boxes */}
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] text-white/90 drop-shadow-2xl mix-blend-overlay">
          The calm <br />
          <span className="text-white/40 font-serif italic tracking-normal">before the storm.</span>
        </h2>

        <p className="mt-8 text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
          We are architecting the next generation of digital experiences.
        </p>

        {/* Premium CTA Button - Matches Brief Page Vibe */}
        <div className="mt-12 group relative inline-block">
          <Link href="/brief">
            <button className="relative px-10 py-5 bg-[#0D0D1A]/80 backdrop-blur-md border border-white/10 hover:border-[#7B2CBF]/50 rounded-full flex items-center gap-4 transition-all duration-500 group-hover:bg-[#7B2CBF]/10 group-hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <span className="text-white text-sm font-bold tracking-[0.2em] uppercase group-hover:text-[#E0AAFF] transition-colors">
                Start Your Project
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#7B2CBF] transition-colors duration-500">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </Link>

          {/* Subtle glow behind button */}
          <div className="absolute -inset-4 bg-[#7B2CBF]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-8 w-full text-center z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">
          © {new Date().getFullYear()} Novembre Systems
        </p>
      </footer>
    </div>
  );
}