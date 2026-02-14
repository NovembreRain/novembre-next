"use client"; // REQUIRED: Tells Next.js this runs in the browser

import { useEffect, useRef } from "react";

export default function StormBackground() {
  // We use Refs instead of 'document.querySelector' to be safe within the React Virtual DOM
  const stormRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This hook runs once when the component "mounts" (appears on screen)
    const stormOverlay = stormRef.current;
    const lightning = lightningRef.current;

    // --- PORTED LOGIC FROM YOUR script.js ---
    
    // 1. Lightning Logic
    let lightningTimeout: NodeJS.Timeout;

    function triggerLightning() {
      if (!lightning) return;
      lightning.classList.add('flash');
      setTimeout(() => lightning.classList.remove('flash'), 500);
    }

    function scheduleLightning() {
      const delay = Math.random() * 12000 + 6000; 
      lightningTimeout = setTimeout(() => {
        triggerLightning();
        scheduleLightning();
      }, delay);
    }
    
    if (lightning) scheduleLightning();

    // 2. Storm Mouse Move Logic
    let rafId: number | null = null;

    function updateOverlay(x: number, y: number) {
      if (!stormOverlay) return;
      // Reusing your exact math
      const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
      const px = clamp(20 + x * 10, 0, 100);
      const py = clamp(80 - y * 10, 0, 100);
      const px2 = clamp(80 - x * 10, 0, 100);
      const py2 = clamp(20 + y * 10, 0, 100);
      
      stormOverlay.style.background = `
        radial-gradient(ellipse at ${px}% ${py}%, rgba(75, 14, 107, 0.4) 0%, transparent 50%),
        radial-gradient(ellipse at ${px2}% ${py2}%, rgba(123, 44, 191, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(45, 10, 62, 0.8) 0%, transparent 70%)
      `;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const lastX = e.clientX / window.innerWidth;
      const lastY = e.clientY / window.innerHeight;
      
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateOverlay(lastX, lastY);
          rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // CLEANUP: Critical for Single Page Apps to prevent memory leaks
    return () => {
      clearTimeout(lightningTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={stormRef} className="storm-overlay"></div>
      <div ref={lightningRef} className="lightning"></div>
    </>
  );
}