import type { Metadata } from "next";
import "./globals.css";
import StormBackground from "@/components/StormBackground";

export const metadata: Metadata = {
  title: "Novembre | Web Developer",
  description: "Performance-first web developer portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: "#0D0D1A", color: "#E8E0F0" }}>
        {/* Background Animation */}
        <StormBackground />

        {/* Main Content Wrapper */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}