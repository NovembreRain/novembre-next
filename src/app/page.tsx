"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function Home() {
  // STATE: Controls the interactive elements
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    // NOTE: We will connect the real API next. For now, we simulate success.
    setTimeout(() => setStatus("success"), 2000);
  }

  // Smooth scroll handler for React
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 overflow-x-hidden">
      <header className="flex items-center justify-between py-8">
        <h1 className="text-2xl font-bold tracking-tight">NOVEMBRE</h1>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <a href="#home" onClick={(e) => handleScroll(e, "home")} className="hover:text-white transition-colors">Home</a>
          <a href="#services" onClick={(e) => handleScroll(e, "services")} className="hover:text-white transition-colors">Services</a>
          <a href="#work" onClick={(e) => handleScroll(e, "work")} className="hover:text-white transition-colors">Work</a>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="hover:text-white transition-colors">Contact</a>
        </nav>
      </header>

      <main className="space-y-32 pb-20">
        <section className="pt-20 md:pt-32" id="home">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Hi, I'm Raj</h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed">I design and develop fast, clean, high-converting websites for businesses.</p>

            {/* UPDATED BUTTON */}
            <Link href="/brief" className="inline-block bg-[#7B2CBF] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              Start Your Project
            </Link>
          </div>
        </section>

        <section id="services">
          <h2 className="text-3xl font-bold mb-12 border-b border-white/10 pb-4">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#7B2CBF]/50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#E0AAFF]">Design Systems</h3>
              <p className="text-gray-400 leading-relaxed">Consistent, scalable UI kits and components.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#7B2CBF]/50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#E0AAFF]">Web Development</h3>
              <p className="text-gray-400 leading-relaxed">Performance-focused sites built with modern stacks.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#7B2CBF]/50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#E0AAFF]">Conversion Optimization</h3>
              <p className="text-gray-400 leading-relaxed">Data-backed improvements to boost signups and sales.</p>
            </div>
          </div>
        </section>

        <section id="work">
          <h2 className="text-3xl font-bold mb-12 border-b border-white/10 pb-4">Selected Work</h2>
          <div className="p-8 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10">
            <strong className="text-white text-lg block mb-2">Lightning Analytics</strong>
            <span className="text-gray-400">— SaaS dashboard redesign, +32% activation.</span>
          </div>
        </section>

        <section id="contact">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact</h2>
              <p className="text-xl text-gray-400">Tell me about your project. I reply within one business day.</p>
            </div>

            <form id="contact-form" className="space-y-4" noValidate onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Your name" required aria-label="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7B2CBF] transition-colors" />
                <input type="email" name="email" placeholder="you@example.com" required aria-label="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7B2CBF] transition-colors" />
              </div>
              <textarea name="message" placeholder="Short message (what do you need?)" rows={4} aria-label="Message"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7B2CBF] transition-colors resize-none"></textarea>

              <div className="flex items-center justify-between">
                {status === "success" ? (
                  <p id="contact-feedback" style={{ color: "#4ADE80" }}>
                    Thanks — message sent.
                  </p>
                ) : (
                  <span></span>
                )}

                <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors disabled:opacity-50" type="submit" id="contact-submit" disabled={status === "loading"}>
                  <span id="submit-text">{status === "loading" ? "Sending..." : "Send"}</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Novembre. All rights reserved.</p>
      </footer>
    </div>
  );
}