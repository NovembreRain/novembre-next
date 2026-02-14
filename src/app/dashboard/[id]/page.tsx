import { createClient } from "@supabase/supabase-js";
import {
    TrendingUp, Users, Globe, Instagram, ArrowUpRight,
    Lightbulb, LayoutDashboard, AlertCircle, Zap, CheckCircle2, Activity,
    MessageCircle
} from "lucide-react";

// --- SETUP ---
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
);

interface Project {
    id: number;
    contact_name: string;
    project_type: string;
    brief_data: any;
}

// --- COMPONENTS ---

// 1. Metric Card (Glass Styling Applied Here)
const MetricCard = ({ label, value, trend, icon: Icon }: any) => (
    // "glass-card" style manually applied: bg-[#151525]/60 backdrop-blur-xl border-white/5
    <div className="bg-[#151525]/60 backdrop-blur-xl border border-white/5 shadow-xl p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 hover:bg-[#151525]/80 transition-all duration-300">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>

        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-white tracking-tight mb-2">{value}</h3>

                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend >= 0 ? 'bg-green-500/10 text-[#4ADE80]' : 'bg-red-500/10 text-[#F87171]'}`}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">vs last 30 days</span>
                </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                <Icon className="w-5 h-5 text-[#E0AAFF]" />
            </div>
        </div>
    </div>
);

const TrafficRow = ({ label, value, color }: any) => (
    <div className="mb-5 last:mb-0 group cursor-default">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wide mb-2">
            <span className="text-[#94A3B8] group-hover:text-white transition-colors">{label}</span>
            <span className="text-white">{value}%</span>
        </div>
        <div className="w-full bg-[#0D0D1A] rounded-full h-2 overflow-hidden border border-white/5">
            <div
                className={`h-full rounded-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

const InsightCard = ({ type, title, desc, impact }: any) => {
    // Direct Border Color Mapping
    const borderColor =
        type === 'critical' ? 'border-l-[#F87171]' :
            type === 'strategy' ? 'border-l-[#C77DFF]' :
                'border-l-[#4ADE80]';

    const iconMap: any = {
        critical: <AlertCircle className="w-4 h-4 text-[#F87171]" />,
        strategy: <Zap className="w-4 h-4 text-[#C77DFF]" />,
        success: <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
    };

    return (
        <div className={`bg-[#151525]/60 backdrop-blur-xl border border-white/5 border-l-4 ${borderColor} p-5 rounded-r-xl rounded-l-none mb-4 hover:bg-[#1E1E30] cursor-pointer group shadow-lg`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    {iconMap[type]}
                    <span className={`text-[10px] font-black uppercase tracking-widest 
            ${type === 'critical' ? 'text-[#F87171]' : type === 'strategy' ? 'text-[#C77DFF]' : 'text-[#4ADE80]'}`}>
                        {type}
                    </span>
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8] bg-white/5 px-2 py-1 rounded">
                    {impact}
                </span>
            </div>
            <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#E0AAFF] transition-colors">{title}</h4>
            <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
        </div>
    );
};

// --- PAGE ---

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Data 
    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    const p = project ? (project as Project) : { contact_name: "Demo Client", project_type: "cafe", brief_data: {} };

    return (
        <div className="min-h-screen pb-20">

            {/* HEADER */}
            <nav className="sticky top-0 z-50 bg-[#0D0D1A]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#7B2CBF] to-[#3B82F6] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">N</div>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <span className="font-bold text-white tracking-tight">{p.contact_name}</span>
                        <span className="text-[10px] font-bold bg-white/5 text-[#94A3B8] px-2 py-0.5 rounded border border-white/5">DASHBOARD</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-wide">Live</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#151525] border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">A</div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-8 space-y-8">

                {/* TOP ACTION BAR */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Performance Overview</h1>
                        <p className="text-[#94A3B8] text-sm">Real-time diagnostics from your digital ecosystem.</p>
                    </div>
                    <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Edit Website
                    </button>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard label="Total Traffic" value="24.5K" trend={12.5} icon={Globe} />
                    <MetricCard label="Engagement" value="3.2%" trend={-0.4} icon={Activity} />
                    <MetricCard label="Leads Generated" value="842" trend={8.2} icon={MessageCircle} />
                    <MetricCard label="Social Clicks" value="1.2K" trend={15.3} icon={Instagram} />
                </div>

                {/* MAIN DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT: TRAFFIC & DIAGNOSTICS (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Traffic Sources Panel */}
                        <div className="bg-[#151525]/60 backdrop-blur-xl border border-white/5 shadow-xl p-8 rounded-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#7B2CBF]" />
                                    Traffic Composition
                                </h3>
                                <span className="text-[10px] font-bold text-[#94A3B8] bg-white/5 px-2 py-1 rounded">LAST 30 DAYS</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    {/* Neon Bars */}
                                    <TrafficRow label="Instagram Bio" value={65} color="bg-gradient-to-r from-pink-500 to-rose-500" />
                                    <TrafficRow label="Google Search" value={42} color="bg-gradient-to-r from-blue-500 to-cyan-500" />
                                    <TrafficRow label="Direct / QR" value={28} color="bg-gradient-to-r from-green-500 to-emerald-500" />
                                </div>

                                {/* Highlight Box */}
                                <div className="bg-gradient-to-br from-[#7B2CBF]/10 to-transparent border border-[#7B2CBF]/20 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#7B2CBF]/10 blur-2xl rounded-full"></div>
                                    <div className="w-10 h-10 bg-[#7B2CBF]/20 rounded-lg flex items-center justify-center mb-4 text-[#E0AAFF]">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-white font-bold mb-2">Dominant Channel: Instagram</h4>
                                    <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                                        65% of your high-intent traffic originates here. However, your "Menu" page has a 40% bounce rate for these users.
                                    </p>
                                    <button className="text-[10px] font-bold text-white bg-[#7B2CBF]/20 border border-[#7B2CBF]/30 py-2 px-4 rounded w-fit hover:bg-[#7B2CBF]/40 transition-colors uppercase tracking-wide">
                                        Optimize Menu UX
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: STRATEGY & INSIGHTS (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-bold text-white text-sm">Diagnostic Feed</h3>
                            <span className="text-[10px] font-bold text-[#E0AAFF] bg-[#7B2CBF]/10 px-2 py-1 rounded-full">4 ACTIONABLE</span>
                        </div>

                        <InsightCard
                            type="critical"
                            title="UX Risk: PDF Menu"
                            desc="PDFs cause high mobile drop-off. Switch to HTML for 40% faster load times."
                            impact="Traffic Retention"
                        />

                        <InsightCard
                            type="strategy"
                            title="Growth Opportunity"
                            desc="Fridays see 3x traffic spikes. Enable 'Auto-Book' CTA on Thursdays."
                            impact="New Revenue"
                        />

                        <InsightCard
                            type="success"
                            title="Local SEO Healthy"
                            desc="Your Google Business Profile ranks #1 for 'Cafe near me' in Bandra."
                            impact="Maintain"
                        />

                        <button className="mt-auto w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-[#94A3B8] hover:border-white/20 hover:text-white transition-all uppercase tracking-widest">
                            View Archived Reports
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}