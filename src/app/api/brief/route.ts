import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

// 1. Initialize Services
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// --- HELPER: Format Brief Data for Notes ---
const formatBriefToNotes = (data: any) => {
    return `
=== PREMIUM BRIEF DETAILS ===

BRAND: ${data.brandName}
CONTACT: ${data.firstName}
PHONE: ${data.phoneNumber || "N/A"}
EMAIL: ${data.email}
TIMEZONE: ${data.timezone || "N/A"}

--- POSITIONING ---
STAGE: ${data.businessStage || "N/A"}
TIMELINE: ${data.launchTimeline || "N/A"}

--- STRATEGY ---
VISION: ${data.successVision || "N/A"}
STACK: ${Array.isArray(data.stackAlignment) ? data.stackAlignment.join(", ") : "N/A"}

--- DESIGN ---
PREFERENCES: ${Array.isArray(data.designPreferences) ? data.designPreferences.join(", ") : "N/A"}

--- CAPABILITIES ---
FOUNDATION: ${data.capabilities?.foundation?.join(", ") || "-"}
COMMERCE: ${data.capabilities?.commerce?.join(", ") || "-"}
AUTOMATION: ${data.capabilities?.automation?.join(", ") || "-"}
AUTHORITY: ${data.capabilities?.authority?.join(", ") || "-"}
ADVANCED: ${data.capabilities?.advanced?.join(", ") || "-"}
`.trim();
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            email,
            firstName,
            brandName,
            phoneNumber,
            preferredDate, // Day number (e.g., 1-31)
            preferredTime, // string (e.g., "Morning")
            ...restOfData
        } = body;

        // 1. Construct scheduled_at
        // Current logic assumes specific time slots roughly map to hours for a valid timestamp
        // For now, we'll create a Date object for the NEXT occurrence of that day number
        const now = new Date();
        let targetYear = now.getFullYear();
        let targetMonth = now.getMonth();

        // If the day is in the past for this month, move to next month
        if (preferredDate < now.getDate()) {
            targetMonth++;
            if (targetMonth > 11) {
                targetMonth = 0;
                targetYear++;
            }
        }

        // Set specific hour based on slot (Approximate for sorting)
        let hour = 9; // Default Morning
        if (preferredTime === "Afternoon") hour = 13;
        if (preferredTime === "Evening") hour = 16;

        const scheduledAt = new Date(targetYear, targetMonth, preferredDate, hour, 0, 0);

        // 2. Prepare Notes
        const notes = formatBriefToNotes(body);

        // 3. Insert into Supabase 'appointments'
        // status defaults to 'pending' as per schema
        const { data: appointment, error: dbError } = await supabase
            .from("appointments")
            .insert([
                {
                    client_name: `${firstName} (${brandName})`,
                    client_email: email,
                    scheduled_at: scheduledAt.toISOString(),
                    notes: notes,
                    // We don't have a user_id yet if they are not logged in, schema allows null?
                    // Schema: user_id uuid references auth.users
                    // If not nullable, this will fail. Assuming nullable based on common patterns for public forms.
                    // If it fails, we might need a service user or check if user exists.
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Supabase Error:", dbError);
            return NextResponse.json({ error: "Failed to save appointment" }, { status: 500 });
        }

        // 4. Prepare Emails (Keep existing logic, just cleaner)
        const msgToOwner = {
            to: process.env.NOTIFY_EMAIL!,
            from: process.env.SENDGRID_FROM!,
            subject: `🚀 New Lead: ${brandName} (${restOfData.businessStage || "Unknown Stage"})`,
            text: `New Premium Brief Received!\n\nView details in Admin Dashboard > Appointments.\n\n${notes}`,
        };

        const msgToClient = {
            to: email,
            from: process.env.SENDGRID_FROM!,
            subject: `We've received your brief for ${brandName}`,
            text: `Hi ${firstName},\n\nThank you for sharing your vision for ${brandName}.\n\nI have received your brief and I'm currently reviewing the details to prepare for our strategy session.\n\nYou will receive a calendar invitation for your requested slot (${scheduledAt.toLocaleDateString()} - ${preferredTime}) within 24 hours.\n\nBest,\nThe Team`,
        };

        // 5. Send Emails
        await Promise.all([
            sgMail.send(msgToOwner),
            sgMail.send(msgToClient)
        ]);

        return NextResponse.json({ success: true, id: appointment.id });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}