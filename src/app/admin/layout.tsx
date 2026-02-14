"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Calendar, Building2, HelpCircle,
    FileText, CalendarDays, Briefcase, LogOut, Menu, X, ArrowRight
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
    { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Properties", href: "/admin/properties", icon: Building2 },
    { label: "Landing + FAQ", href: "/admin/landing", icon: HelpCircle },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Careers", href: "/admin/careers", icon: Briefcase },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Don't show layout on login page (although middleware should handle auth, layout persists)
    if (pathname === "/admin/login") return <>{children}</>;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#0D0D1A] flex font-sans text-white">

            {/* MOBILE MENU TOGGLE */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-[#151525] rounded-lg border border-white/10 text-white"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* SIDEBAR */}
            <motion.aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#151525] border-r border-white/5 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#7B2CBF] to-[#3B82F6] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">A</div>
                        <span className="font-bold text-lg tracking-tight">Admin Panel</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-[#7B2CBF]/10 text-[#E0AAFF] border border-[#7B2CBF]/20' : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'}`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#7B2CBF]' : 'text-[#64748B] group-hover:text-white'}`} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                    {isActive && <motion.div layoutId="active-indicator" className="ml-auto w-1 h-1 bg-[#7B2CBF] rounded-full" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border border-white/10" />
                            <div>
                                <p className="text-xs font-bold text-white">Admin User</p>
                                <p className="text-[10px] text-[#94A3B8]">Super Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-[#94A3B8] transition-all group text-sm font-medium border border-transparent hover:border-red-500/20"
                        >
                            <span className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 relative overflow-y-auto h-screen scrollbar-hide">
                {/* Top Fade */}
                <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0D0D1A] to-transparent pointer-events-none md:ml-64 z-30" />

                <div className="relative z-10 max-w-7xl mx-auto pt-8">
                    {children}
                </div>

                {/* Bottom Fade */}
                <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0D0D1A] to-transparent pointer-events-none md:ml-64 z-30" />
            </main>

        </div>
    );
}
