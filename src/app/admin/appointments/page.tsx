import { createClient } from "@/utils/supabase/server";
import AppointmentsView from "./appointment-view";

export default async function AdminAppointments() {
    const supabase = await createClient();

    // DEBUG: Check User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("Admin Page User:", user?.id, user?.email);
    if (authError) console.error("Auth Error:", authError);

    // Fetch data from 'appointments' table
    const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_at", { ascending: false });

    console.log("Appointments Fetch Result:", { count: appointments?.length, error });

    if (error) {
        console.error("Error fetching appointments:", error);
    }

    return (
        <div className="space-y-6 h-[calc(100vh-140px)]">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
                    <p className="text-[#94A3B8]">Manage bookings and Digital Flagship briefs.</p>
                </div>
                <div className="bg-[#7B2CBF]/10 border border-[#7B2CBF]/20 text-[#E0AAFF] px-4 py-2 rounded-lg text-sm font-medium">
                    {appointments?.length || 0} Total Briefs
                </div>
            </div>

            <AppointmentsView appointments={appointments || []} />
        </div>
    );
}
