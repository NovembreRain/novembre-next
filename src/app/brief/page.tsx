"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
    ArrowRight, Check, ChevronDown, Calendar, Clock, Lock,
    Leaf, TrendingUp, Zap, Crown, Building2, Play, Pause,
    Globe, LayoutTemplate, MessageSquare, CreditCard, Bot,
    FileText, Search, Wrench, ShieldCheck, Mail, Loader2, Sparkles, Phone, Monitor
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TYPES & DATA ---

const INITIAL_DATA = {
    // 0. Personalization
    firstName: "",
    brandName: "",

    // 1. Business Stage
    businessStage: "",

    // 2. Design Direction
    designPreferences: [] as string[],

    // 3. Stack Alignment (Moved)
    stackAlignment: [] as string[],

    // 4. Timeline (Moved)
    launchTimeline: "",

    // 5. Capabilities (Moved)
    capabilities: {
        foundation: [] as string[],
        commerce: [] as string[],
        automation: [] as string[],
        authority: [] as string[],
        advanced: [] as string[]
    },

    // 6. Strategic Intent
    successVision: "",

    // 7. Call Scheduling
    preferredDate: "",
    preferredTime: "",
    timezone: "",
    email: "",
    phoneNumber: ""
};

// --- CONSTANTS ---

const STAGES = [
    { id: "starting", label: "Just Starting", desc: "Need a strong digital foundation", icon: Leaf },
    { id: "growing", label: "Growing", desc: "Website exists but needs serious upgrade", icon: TrendingUp },
    { id: "scaling", label: "Scaling", desc: "Need automation / bookings / integrations", icon: Zap },
    { id: "established", label: "Established", desc: "Need premium positioning & performance", icon: Crown },
    { id: "complex", label: "Complex Systems", desc: "Agency / Multi-location / Enterprise needs", icon: Building2 },
];

const DESIGN_DIRECTIONS = [
    { id: "bold_immersive", title: "Bold & Immersive", desc: "High-impact visuals with narrative depth", video: "/videos/bold-preview.mp4" },
    { id: "minimal_elegant", title: "Minimal & Elegant", desc: "Clean lines, sophisticated typography", video: "/videos/minimal-preview.mp4" },
    { id: "playful_dynamic", title: "Playful & Dynamic", desc: "Bright colors, motion, and interaction", video: "/videos/playful-preview.mp4" },
    { id: "tech_futuristic", title: "Tech & Futuristic", desc: "Dark mode, neon accents, grid layouts", video: "/videos/tech-preview.mp4" },
    { id: "editorial_luxury", title: "Editorial Luxury", desc: "High-fashion magazine layout style", video: "/videos/editorial-preview.mp4" },
];

const STACKS = [
    {
        id: "foundation_only",
        title: "Foundation Stack",
        desc: "High-performance website, Conversion structure, Mobile-first, Core integrations",
        icon: Building2,
        color: "from-blue-500 to-indigo-500"
    },
    {
        id: "foundation_identity",
        title: "Identity Stack",
        desc: "Professional brand kit, Typography system, Messaging framework, Copywriting",
        icon: LayoutTemplate,
        color: "from-pink-500 to-rose-500"
    },
    {
        id: "growth_focused",
        title: "Growth Stack",
        desc: "Booking/Ecommerce, Marketing automation, CRM & WhatsApp, Lead capture",
        icon: TrendingUp,
        color: "from-amber-400 to-orange-500"
    },
    {
        id: "full_stack",
        title: "Full Stack System",
        desc: "Custom dashboard, Maintenance plan, Performance monitoring, Monthly reports",
        icon: ShieldCheck,
        color: "from-purple-500 to-violet-600"
    },
];

const TIMELINES = [
    { id: "exploring", label: "Exploring ideas — no fixed timeline" },
    { id: "3_4_months", label: "Within 3–4 months" },
    { id: "1_2_months", label: "Within 1–2 months" },
    { id: "30_days", label: "Within 30 days" },
    { id: "urgent", label: "Urgent — under 2 weeks" },
];

const CAPABILITIES = {
    foundation: { icon: Building2, title: "Foundation", items: ["Modern Website", "Conversion Optimized LP", "Brand Kit", "Strategic Copywriting"] },
    commerce: { icon: CreditCard, title: "Commerce", items: ["Ecommerce Platform", "Booking Engine", "Membership Systems", "Payment Integration"] },
    automation: { icon: Bot, title: "Automation", items: ["WhatsApp Automation", "Email Workflows", "CRM Integration", "AI Chatbot"] },
    authority: { icon: FileText, title: "Authority", items: ["Blog / SEO Infrastructure", "Case Study Templates", "Testimonial Engine", "Multi-language"] },
    advanced: { icon: Wrench, title: "Advanced", items: ["Custom Admin Dashboard", "Analytics & Reporting", "Maintenance Plan", "Performance Opt"] }
};

const TIME_SLOTS = [
    { label: "Morning", sub: "9 AM - 12 PM" },
    { label: "Afternoon", sub: "12 PM - 3 PM" },
    { label: "Evening", sub: "3 PM - 6 PM" },
    { label: "Flexible", sub: "Any time" }
];

// --- COMPONENTS ---

const FadeIn = ({ children, delay = 0, className = "" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const InputField = ({ label, ...props }: any) => (
    <div className="w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input
            className="w-full bg-white/5 border-b border-white/10 py-4 px-4 text-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B2CBF] focus:bg-white/10 transition-all font-light rounded-t-lg"
            {...props}
        />
    </div>
);

const VideoCard = ({ item, selected, onClick }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => { videoRef.current?.pause(); if (videoRef.current) videoRef.current.currentTime = 0; }}
            className={`relative rounded-xl overflow-hidden cursor-pointer aspect-[4/5] group border transition-all duration-300 ${selected ? 'border-[#7B2CBF] ring-2 ring-[#7B2CBF]/30 scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
        >
            <div className="absolute inset-0 bg-[#151525]">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center">
                    <Play className={`w-12 h-12 text-white/10 ${selected ? 'text-[#7B2CBF]' : ''}`} />
                </div>
                {/* 
                  NOTE: Ensure these video paths exist in public/videos or use placeholders.
                  If not, this will just show the poster/placeholder.
                */}
                <video
                    ref={videoRef}
                    src={item.video}
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            <div className="absolute top-3 right-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selected ? 'bg-[#7B2CBF] border-[#7B2CBF]' : 'border-white/30 bg-black/30'}`}>
                    {selected && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="font-bold text-white text-lg leading-tight mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
            </div>
        </div>
    );
};

const CapabilityGroup = ({ category, data, toggle }: any) => {
    const Icon = CAPABILITIES[category as keyof typeof CAPABILITIES].icon;
    const info = CAPABILITIES[category as keyof typeof CAPABILITIES];

    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-[#E0AAFF]">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">{info.title}</h3>
            </div>
            <div className="space-y-2">
                {info.items.map((item) => {
                    const isSelected = data.capabilities[category].includes(item);
                    return (
                        <div
                            key={item}
                            onClick={() => toggle(category, item)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-[#7B2CBF]/20 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#7B2CBF] border-[#7B2CBF]' : 'border-gray-600'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium">{item}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CalendarUI = ({ date, time, onDateChange, onTimeChange }: any) => {
    // A simplified monthly view - in a real app, use date-fns and a grid generator
    // This is a static representation of "Current Month" for UI demo purposes, similar to the screenshot
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = 30; // Simplified
    const startDay = 3; // Wednesday, simplified offset

    return (
        <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Calendar Grid */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-xl text-white">{currentMonth}</span>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronDown className="rotate-90 w-4 h-4 text-gray-400" /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronDown className="-rotate-90 w-4 h-4 text-gray-400" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-4 mb-2">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-gray-500">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const d = i + 1;
                        const isSelected = date === d;
                        return (
                            <button
                                key={d}
                                onClick={() => onDateChange(d)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-[#7B2CBF] text-white shadow-lg shadow-purple-500/30' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                {d}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div className="md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-[#7B2CBF]" />
                    <span className="text-xs font-bold text-[#E0AAFF] uppercase tracking-widest">20 Min Strategy Session</span>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Available Times</label>
                    {TIME_SLOTS.map((slot) => (
                        <button
                            key={slot.label}
                            onClick={() => onTimeChange(slot.label)}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${time === slot.label ? 'bg-[#7B2CBF]/10 border-[#7B2CBF] text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <span className="font-medium">{slot.label}</span>
                            <span className="text-xs opacity-60">{slot.sub}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN FORM ---

export default function PreCallIntelForm() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));

    // Auto-detect timezone
    useEffect(() => {
        update("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const toggleCapability = (category: string, item: string) => {
        const current = data.capabilities[category as keyof typeof data.capabilities];
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];

        update("capabilities", { ...data.capabilities, [category]: updated });
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 7));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const handleFinish = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Submission Failed");

            // Show success screen
            setSubmitted(true);

            // Redirect after 4 seconds
            setTimeout(() => {
                router.push("/");
            }, 4000);

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please check your connection.");
            setLoading(false);
        }
    };

    // --- SUCCESS SCREEN ---
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#7B2CBF]/20 via-[#0D0D1A] to-[#0D0D1A]" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-[#7B2CBF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(123,44,191,0.5)]">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                        >
                            <Check className="w-10 h-10 text-white" />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">You're all set, {data.firstName}!</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        We've received your brief. Our team is already reviewing your vision and will confirm your strategy session within <span className="text-[#E0AAFF] font-bold">24 hours</span>.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 uppercase tracking-widest">
                        <Loader2 className="w-4 h-4 animate-spin" /> Redirecting home...
                    </div>
                </motion.div>
            </div>
        )
    }

    const screens = [
        // 0. Greeting
        <div className="space-y-8 p-1">
            <FadeIn delay={0.1}>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 0 — Welcome</span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Hello {data.brandName || "Visionary"}</h1>
                <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                    We're Novembre. A decade of building high-converting digital systems across industries. Before we connect, help us understand you better.
                </p>
            </FadeIn>

            <FadeIn delay={0.3} className="space-y-6 pt-8 max-w-md">
                <InputField
                    label="How should we address you?"
                    placeholder="Your first name"
                    value={data.firstName}
                    onChange={(e: any) => update("firstName", e.target.value)}
                    autoFocus
                />
                <InputField
                    label="What is your Brand Name?"
                    placeholder="Brand / Company Name"
                    value={data.brandName}
                    onChange={(e: any) => update("brandName", e.target.value)}
                />
                <p className="text-xs text-gray-600 italic">This helps us personalize your strategy.</p>
            </FadeIn>
        </div>,

        // 1. Business Stage (Positioning)
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 1 — Context</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">What stage best describes your business today?</h2>
                <p className="text-gray-400 text-lg">This helps us architect the right system for your ambition.</p>
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 pt-4 max-w-2xl">
                {STAGES.map((s, i) => (
                    <FadeIn key={s.id} delay={i * 0.1}>
                        <div
                            onClick={() => update("businessStage", s.id)}
                            className={`p-5 rounded-xl border flex items-center gap-5 cursor-pointer transition-all group ${data.businessStage === s.id ? 'bg-[#7B2CBF]/20 border-[#7B2CBF]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className={`p-3 rounded-full ${data.businessStage === s.id ? 'bg-[#7B2CBF] text-white' : 'bg-[#151525] text-gray-400 group-hover:text-white'}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${data.businessStage === s.id ? 'text-white' : 'text-gray-300'}`}>{s.label}</h3>
                                <p className="text-sm text-gray-500">{s.desc}</p>
                            </div>
                            <div className="ml-auto">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.businessStage === s.id ? 'border-[#7B2CBF] bg-[#7B2CBF]' : 'border-gray-600'}`}>
                                    {data.businessStage === s.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>,

        // 2. Design Direction
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 2 — Aesthetics</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Here are 5 design directions we curated for {data.brandName || "you"}</h2>
                <p className="text-gray-400 text-lg">Select up to 2 that resonate with your vision.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
                {DESIGN_DIRECTIONS.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.1}>
                        <VideoCard
                            item={item}
                            selected={data.designPreferences.includes(item.id)}
                            onClick={() => {
                                const current = data.designPreferences;
                                if (current.includes(item.id)) update("designPreferences", current.filter(id => id !== item.id));
                                else if (current.length < 2) update("designPreferences", [...current, item.id]);
                            }}
                        />
                    </FadeIn>
                ))}
            </div>
            <p className="text-xs text-gray-600 italic">We'll use these as strategic anchors during our call.</p>
        </div>,

        // 3. Stack Alignment (Architecture) - MOVED
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 3 — Architecture</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Every digital system we build has layers</h2>
                <p className="text-gray-400 text-lg">Here's how we structure projects for maximum impact.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                {STACKS.map((stack, i) => {
                    const isSelected = (data.stackAlignment as any).includes(stack.id);
                    return (
                        <FadeIn key={stack.id} delay={i * 0.1} className="h-full">
                            <div
                                onClick={() => {
                                    const current = (data.stackAlignment as unknown as string[]);
                                    // Radio behavior for stack? User prompt implied radio "Radio Options", but code was checkbox. 
                                    // Prompt says: "Which stack feels aligned... Radio Options".
                                    // So changing to single select.
                                    update("stackAlignment", [stack.id]);
                                }}
                                className={`p-6 rounded-2xl border h-full flex flex-col cursor-pointer transition-all duration-300 relative overflow-hidden group ${isSelected ? 'border-white/20' : 'border-white/5 hover:border-white/10 bg-white/5'}`}
                            >
                                {isSelected && (
                                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${stack.color}`} />
                                )}

                                <div className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${stack.color} text-white shadow-lg`}>
                                    <stack.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{stack.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">{stack.desc}</p>

                                <div className="mt-auto">
                                    <div className={`w-full py-2 rounded-lg border flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-colors ${isSelected ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500'}`}>
                                        {isSelected ? 'Selected' : 'Select'}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    )
                })}
            </div>
            <p className="text-xs text-gray-600 italic">We'll discuss specific pricing during our strategy call.</p>
        </div>,

        // 4. Timeline
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 4 — Timeline</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">When are you looking to launch?</h2>
                <p className="text-gray-400 text-lg">This helps us allocate the right resources for your project.</p>
            </FadeIn>

            <div className="space-y-4 max-w-xl">
                {TIMELINES.map((t, i) => (
                    <FadeIn key={t.id} delay={i * 0.1}>
                        <div
                            onClick={() => update("launchTimeline", t.id)}
                            className={`flex items-center justify-between p-6 rounded-xl border cursor-pointer transition-all ${data.launchTimeline === t.id ? 'bg-[#7B2CBF] border-[#7B2CBF] text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                        >
                            <span className="font-bold text-lg">{t.label}</span>
                            {data.launchTimeline === t.id && <Check className="w-5 h-5 text-white" />}
                        </div>
                    </FadeIn>
                ))}
            </div>
            <p className="text-xs text-gray-600 italic mt-4">Timelines are flexible. This is just for planning purposes.</p>
        </div>,

        // 5. Capabilities - MOVED
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 5 — Features</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">What capabilities should your system include?</h2>
                <p className="text-gray-400 text-lg">Select all that align with your business objectives.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {Object.keys(CAPABILITIES).map((cat, i) => (
                    <FadeIn key={cat} delay={i * 0.05}>
                        <CapabilityGroup
                            category={cat}
                            data={data}
                            toggle={toggleCapability}
                        />
                    </FadeIn>
                ))}
            </div>
            <p className="text-xs text-gray-600 italic">We'll structure your quote around these core requirements.</p>
        </div>,

        // 6. Strategic Intent (Vision)
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 6 — Vision</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">If this project succeeds, what changes for your business?</h2>
                <p className="text-gray-400 text-lg">Help us understand the real goal behind this investment.</p>
            </FadeIn>

            <FadeIn delay={0.2} className="relative max-w-3xl">
                <textarea
                    value={data.successVision}
                    onChange={(e) => update("successVision", e.target.value)}
                    placeholder="Example: We'll finally capture leads 24/7, reduce manual inquiries by 60%, and position ourselves as the premium option in our market..."
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B2CBF] resize-none leading-relaxed"
                    maxLength={3000}
                />
                <div className="absolute bottom-6 right-6 text-xs font-bold uppercase tracking-widest text-[#7B2CBF]">
                    This drives everything we build. Be specific.
                </div>
            </FadeIn>
        </div>,

        // 7. Scheduler (The Call)
        <div className="space-y-8 p-1">
            <FadeIn>
                <span className="text-[#7B2CBF] font-bold tracking-widest uppercase text-xs mb-2 block">Step 7 — The Call</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Let's architect this properly</h2>
                <p className="text-gray-400 text-lg">We structure calls like strategy sessions, not sales calls.</p>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                <FadeIn delay={0.2} className="lg:col-span-2">
                    <CalendarUI
                        date={data.preferredDate}
                        time={data.preferredTime}
                        onDateChange={(d: any) => update("preferredDate", d)}
                        onTimeChange={(t: any) => update("preferredTime", t)}
                    />
                </FadeIn>

                <FadeIn delay={0.4} className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Contact Details</h3>
                        <InputField
                            label="Email Address"
                            type="email"
                            placeholder="you@company.com"
                            value={(data as any).email}
                            onChange={(e: any) => update("email", e.target.value)}
                        />
                        <InputField
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="+1 ..."
                            value={data.phoneNumber}
                            onChange={(e: any) => update("phoneNumber", e.target.value)}
                        />
                        <InputField
                            label="Your Timezone"
                            value={data.timezone}
                            onChange={(e: any) => update("timezone", e.target.value)}
                        />
                        <p className="text-xs text-gray-500 pt-2">For WhatsApp confirmation or if we need to reschedule.</p>
                    </div>

                    <div className="p-4 bg-[#7B2CBF]/10 rounded-xl border border-[#7B2CBF]/20 text-sm text-[#E0AAFF]">
                        You'll receive a calendar invite within 24 hours with a personalized agenda based on everything you've shared today.
                    </div>
                </FadeIn>
            </div>
        </div>
    ];


    return (
        <div className="min-h-screen bg-[#0D0D1A] text-white font-sans selection:bg-[#7B2CBF]/30 selection:text-white flex flex-col">

            {/* Top Bar */}
            <div className="px-6 py-6 flex justify-between items-center fixed top-0 w-full z-50 bg-gradient-to-b from-[#0D0D1A] to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <span className="font-bold tracking-tight text-xl">Novembre</span>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-[#7B2CBF]' : 'w-2 bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative">
                <div className="max-w-6xl w-full pt-20 pb-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {screens[step]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 w-full p-6 md:p-10 z-50 bg-gradient-to-t from-[#0D0D1A] via-[#0D0D1A]/90 to-transparent">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={step === 0}
                        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronDown className="rotate-90 w-4 h-4" /> Back
                    </button>

                    {step < 7 ? (
                        <button
                            onClick={nextStep}
                            className="group bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Continue <ArrowRight className="w-4 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            disabled={loading}
                            className="group bg-[#7B2CBF] text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 hover:bg-[#8B3CCF] transition-all shadow-[0_0_30px_rgba(123,44,191,0.4)]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Confirm & Schedule"}
                            {!loading && <ArrowRight className="w-4 h-5" />}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}