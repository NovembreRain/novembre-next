"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, Mail, Phone, MapPin,
    ChevronRight, Search, Filter, MoreVertical,
    Building2, Zap, Rocket, LayoutTemplate, Star
} from "lucide-react";

// --- TYPES ---

type Appointment = {
    id: string;
    created_at: string;
    client_name: string;
    client_email: string;
    scheduled_at: string;
    status: string;
    notes: string;
};

// --- PARSER UTILITY ---

function parseNotesToDossier(notes: string) {
    // Helper to extract value after a label
    const extract = (label: string) => {
        const regex = new RegExp(`${label}:\\s*(.+)`, 'i');
        const match = notes.match(regex);
        return match ? match[1].trim() : null;
    };

    // Helper to extract a section
    const extractSection = (header: string, nextHeader: string) => {
        const start = notes.indexOf(header);
        if (start === -1) return [];

        let end = notes.indexOf(nextHeader, start);
        if (end === -1) end = notes.length;

        const content = notes.substring(start + header.length, end).trim();
        return content.split('\n')
            .filter(line => line.includes(':'))
            .map(line => {
                const [key, ...values] = line.split(':');
                return { key: key.trim(), value: values.join(':').trim() };
            });
    };

    return {
        brand: extract("BRAND"),
        contact: extract("CONTACT"),
        phone: extract("PHONE"),
        email: extract("EMAIL"),
        timezone: extract("TIMEZONE"),
        positioning: extractSection("--- POSITIONING ---", "--- STRATEGY ---"),
        strategy: extractSection("--- STRATEGY ---", "--- DESIGN ---"),
        design: extractSection("--- DESIGN ---", "--- CAPABILITIES ---"),
        capabilities: extractSection("--- CAPABILITIES ---", "--- MEETING REQUEST ---"),
        meeting: extractSection("--- MEETING REQUEST ---", "Log in to dashboard")
    };
}

// --- COMPONENTS ---

export default function AppointmentsView({ appointments }: { appointments: Appointment[] }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");

    const selectedAppointment = appointments.find(a => a.id === selectedId);
    const dossier = selectedAppointment ? parseNotesToDossier(selectedAppointment.notes) : null;

    // Sort by scheduled_at desc
    const sortedAppointments = [...appointments].sort((a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    );

    return (
        <div className="flex bg-[#151525] border border-white/5 rounded-3xl overflow-hidden h-[calc(100vh-140px)] shadow-2xl">

            {/* --- LIST SIDEBAR --- */}
            <div className={`w-full md:w-96 flex-shrink-0 border-r border-white/5 bg-[#0D0D1A]/50 flex flex-col transition-all duration-300 ${selectedId ? 'hidden md:flex' : 'flex'}`}>

                {/* Search / Filter Header */}
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            placeholder="Search client..."
                            className="w-full bg-[#151525] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#7B2CBF]"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {sortedAppointments.map((apt) => {
                        const date = new Date(apt.scheduled_at);
                        const isSelected = selectedId === apt.id;
                        const isPast = date < new Date();

                        return (
                            <motion.div
                                layoutId={apt.id}
                                key={apt.id}
                                onClick={() => setSelectedId(apt.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden
                                    ${isSelected
                                        ? 'bg-[#7B2CBF]/10 border-[#7B2CBF]/30 shadow-lg'
                                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-bold truncate pr-4 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                        {apt.client_name}
                                    </h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${isPast ? 'bg-white/5 text-gray-500' : 'bg-green-500/10 text-green-400'}`}>
                                        {isPast ? 'Completed' : 'Upcoming'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </div>

                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7B2CBF]" />}
                            </motion.div>
                        );
                    })}

                    {appointments.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            No appointments found.
                        </div>
                    )}
                </div>
            </div>

            {/* --- DOSSIER MAIN VIEW --- */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar relative bg-[#0D0D1A] ${selectedId ? 'block' : 'hidden md:block'}`}>
                {selectedAppointment && dossier ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={selectedId}
                        className="p-6 md:p-10 max-w-4xl mx-auto space-y-10"
                    >
                        {/* Header Actions (Mobile Back) */}
                        <div className="md:hidden mb-6">
                            <button onClick={() => setSelectedId(null)} className="text-sm text-gray-400 flex items-center gap-1">
                                ← Back to list
                            </button>
                        </div>

                        {/* HERO SECTION */}
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7B2CBF] to-transparent rounded-full" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{dossier.brand || selectedAppointment.client_name}</h1>
                            <p className="text-xl text-[#7B2CBF] font-light">Digital Flagship Construction Brief</p>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <Badge icon={Mail} text={dossier.contact} />
                                <Badge icon={Phone} text={dossier.phone} sub={dossier.email} />
                                <Badge icon={Clock} text={dossier.timezone} />
                            </div>
                        </div>

                        {/* STRATEGIC INTENT GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Vision Card */}
                            <SectionCard title="Strategic Vision" icon={Rocket} color="purple">
                                {dossier.strategy?.find(i => i.key === 'VISION')?.value || "No vision provided."}
                            </SectionCard>

                            {/* Stack Card */}
                            <SectionCard title="Architecture Stack" icon={LayoutTemplate} color="blue">
                                <div className="flex flex-wrap gap-2">
                                    {(dossier.strategy?.find(i => i.key === 'STACK')?.value || "").split(',').map((stack: string) => (
                                        <span key={stack} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                                            {stack.trim()}
                                        </span>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>

                        {/* CONTEXT & DESIGN */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 space-y-6">
                                <InfoBlock title="Business Stage" value={dossier.positioning?.find(i => i.key === 'STAGE')?.value} />
                                <InfoBlock title="Launch Timeline" value={dossier.positioning?.find(i => i.key === 'TIMELINE')?.value} />
                            </div>

                            <SectionCard title="Design Alignment" icon={Star} color="pink" className="md:col-span-2">
                                <div className="flex flex-wrap gap-2">
                                    {(dossier.design?.find(i => i.key === 'PREFERENCES')?.value || "").split(',').map((pref: string) => (
                                        <span key={pref} className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-sm border border-pink-500/20">
                                            {pref.trim()}
                                        </span>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>

                        {/* CAPABILITIES MATRIX */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> System Capabilities
                            </h3>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {dossier.capabilities?.map((cap) => (
                                    <div key={cap.key}>
                                        <span className="block text-xs font-bold text-[#E0AAFF] mb-2">{cap.key}</span>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {cap.value === '-' ? <span className="text-gray-600 italic">None selected</span> : cap.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* META DATA FOOTER */}
                        <div className="border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600">
                            <span>ID: {selectedAppointment.id}</span>
                            <span>Submitted: {new Date(selectedAppointment.created_at).toLocaleString()}</span>
                        </div>

                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 p-10 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Rocket className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-gray-500 mb-2">Select a dossier to view details</p>
                        <p className="text-sm">Review incoming briefs and prepare for strategy sessions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

const Badge = ({ icon: Icon, text, sub }: any) => (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
        <Icon className="w-4 h-4 text-gray-400" />
        <div className="text-sm text-gray-200">
            <span>{text || "N/A"}</span>
            {sub && <span className="opacity-50 ml-2 border-l border-white/20 pl-2">{sub}</span>}
        </div>
    </div>
);

const SectionCard = ({ title, icon: Icon, children, color = "purple", className = "" }: any) => {
    const colors: any = {
        purple: "text-[#E0AAFF] bg-[#E0AAFF]/10",
        blue: "text-blue-400 bg-blue-400/10",
        pink: "text-pink-400 bg-pink-400/10"
    };

    return (
        <div className={`bg-white/5 rounded-2xl p-6 border border-white/5 ${className}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${colors[color].split(' ')[0]}`}>
                <Icon className="w-4 h-4" /> {title}
            </h3>
            <div className="text-gray-300 leading-relaxed text-lg font-light">
                {children}
            </div>
        </div>
    );
}

const InfoBlock = ({ title, value }: any) => (
    <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-white text-lg">{value || "N/A"}</p>
    </div>
);
