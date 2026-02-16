import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

// Services initialized inside handler to avoid build-time errors


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
        // 1. Initialize Services (Lazy load to prevent build errors)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE!
        );
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        const body = await req.json();
        console.log("Brief Submission Payload:", JSON.stringify(body, null, 2));

        const {
            email,
            firstName,
            brandName,
            phoneNumber,
            preferredDate, // Expected: number (1-31)
            preferredTime, // Expected: string
            ...restOfData
        } = body;

        // 1. Construct scheduled_at
        const now = new Date();
        let scheduledAt: Date;

        if (!preferredDate) {
            console.warn("No preferredDate provided, defaulting to 24h from now.");
            scheduledAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else {
            let targetYear = now.getFullYear();
            let targetMonth = now.getMonth();

            // Validate preferredDate is a number
            const day = parseInt(String(preferredDate), 10);
            if (isNaN(day)) {
                throw new Error(`Invalid preferredDate: ${preferredDate}`);
            }

            // If the day is in the past for this month, move to next month
            if (day < now.getDate()) {
                targetMonth++;
                if (targetMonth > 11) {
                    targetMonth = 0;
                    targetYear++;
                }
            }

            // Set specific hour
            let hour = 9; // Default Morning
            if (preferredTime === "Afternoon") hour = 13;
            if (preferredTime === "Evening") hour = 16;

            scheduledAt = new Date(targetYear, targetMonth, day, hour, 0, 0);
        }

        // Validate Date validity
        if (isNaN(scheduledAt.getTime())) {
            throw new Error("Failed to construct a valid scheduled_at date.");
        }

        console.log("Constructed scheduled_at:", scheduledAt.toISOString());

        // 2. Prepare Notes
        const notes = formatBriefToNotes(body);

        // 3. Insert into Supabase 'appointments'
        const { data: appointment, error: dbError } = await supabase
            .from("appointments")
            .insert([
                {
                    client_name: `${firstName} (${brandName})`,
                    client_email: email,
                    scheduled_at: scheduledAt.toISOString(),
                    notes: notes,
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Supabase Insert Error:", dbError);
            return NextResponse.json({ error: dbError.message || "Database Error" }, { status: 500 });
        }

        // 4. Prepare Emails
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
            text: `Hi ${firstName},\n\nThank you for sharing your vision for ${brandName}.\n\nI have received your brief and I'm currently reviewing the details to prepare for our strategy session.\n\nYou will receive a calendar invitation for your requested slot (${scheduledAt.toLocaleDateString()} - ${preferredTime || "Flexible"}) within 24 hours.\n\nBest,\nThe Team`,
        };

        // 5. Send Emails
        try {
            await Promise.all([
                sgMail.send(msgToOwner),
                sgMail.send(msgToClient)
            ]);
        } catch (emailError) {
            console.error("SendGrid Error (Non-fatal):", emailError);
            // Continue even if email fails, as DB save was successful
        }

        return NextResponse.json({ success: true, id: appointment.id });

    } catch (error: any) {
        console.error("API Critical Error:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            stack: error.stack
        }, { status: 500 });
    }
}