export default function AdminOverview() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
                    <p className="text-[#94A3B8]">Welcome back, Admin.</p>
                </div>
            </div>

            <div className="p-8 rounded-2xl border border-white/5 bg-[#151525]/50 flex items-center justify-center min-h-[400px] text-[#94A3B8]">
                Select a section from the sidebar to manage content.
            </div>
        </div>
    );
}
