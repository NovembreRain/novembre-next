"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { motion, Variants } from "framer-motion";
import { Loader2, ArrowRight, Lock } from "lucide-react";

// --- ANIMATIONS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 50 }
    }
};

export default function AdminLoginPage() {
    // Use useActionState for form handling (Next.js 14/15 pattern)
    // State is essentially the return value from the server action
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        return await login(formData);
    }, null);

    return (
        <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B2CBF] rounded-full blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4ADE80] rounded-full blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#151525]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">

                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7B2CBF] to-[#3B82F6] rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                        <p className="text-[#94A3B8] text-sm">authenticate to continue</p>
                    </motion.div>

                    <form action={formAction} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="admin@novembre.io"
                                className="w-full bg-[#0D0D1A]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B2CBF] transition-all"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••••••"
                                className="w-full bg-[#0D0D1A]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B2CBF] transition-all"
                            />
                        </motion.div>

                        {state?.error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-[#F87171] text-sm text-center bg-[#F87171]/10 p-2 rounded-lg"
                            >
                                {state.error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-[#7B2CBF] hover:bg-[#8B3CCF] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(123,44,191,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                    <>
                                        Enter Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                </div>

                <motion.p variants={itemVariants} className="text-center text-[#94A3B8] text-xs mt-8 opacity-50">
                    Novembre © 2026. Secure Environment.
                </motion.p>

            </motion.div>
        </div>
    );
}
