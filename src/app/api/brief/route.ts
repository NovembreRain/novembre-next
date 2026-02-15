import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

// 1. Initialize Services
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            email,
            firstName,
            brandName,
            phoneNumber,
            // Destructure specific fields to explicitly handle them,
            // but we'll put everything else into brief_data too
            ...restOfData
        } = body;

        // 1. Insert into Supabase
        const { data: project, error: dbError } = await supabase
            .from("projects")
            .insert([
                {
                    contact_email: email,
                    contact_name: `${firstName} (${brandName})`,
                    contact_phone: phoneNumber,
                    project_type: "premium_brief",
                    brief_data: {
                        firstName,
                        brandName,
                        phoneNumber,
                        email,
                        ...restOfData
                    }
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Supabase Error:", dbError);
            return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
        }

        // 2. Prepare Emails
        // Email to YOU (The Agency Owner)
        const msgToOwner = {
            to: process.env.NOTIFY_EMAIL!,
            from: process.env.SENDGRID_FROM!,
            subject: `🚀 New Lead: ${brandName} (${restOfData.businessStage || "Unknown Stage"})`,
            text: `
New Premium Brief Received!

CONTACT
-------
Name: ${firstName}
Brand: ${brandName}
Email: ${email}
Phone: ${phoneNumber || "N/A"}
Timezone: ${restOfData.timezone || "N/A"}

POSITIONING
-----------
Stage: ${restOfData.businessStage || "N/A"}
Timeline: ${restOfData.launchTimeline || "N/A"}

STRATEGY
--------
Vision: ${restOfData.successVision || "N/A"}
Stack: ${Array.isArray(restOfData.stackAlignment) ? restOfData.stackAlignment.join(", ") : "N/A"}

DESIGN DIRECTION
----------------
Preferences: ${Array.isArray(restOfData.designPreferences) ? restOfData.designPreferences.join(", ") : "N/A"}

CAPABILITIES
------------
Foundation: ${restOfData.capabilities?.foundation?.join(", ") || "-"}
Commerce: ${restOfData.capabilities?.commerce?.join(", ") || "-"}
Automation: ${restOfData.capabilities?.automation?.join(", ") || "-"}
Authority: ${restOfData.capabilities?.authority?.join(", ") || "-"}
Advanced: ${restOfData.capabilities?.advanced?.join(", ") || "-"}

MEETING REQUEST
---------------
Date: ${restOfData.preferredDate || "Not selected"}
Time: ${restOfData.preferredTime || "Not selected"}

Log in to dashboard for full details.
`,
        };

        // Email to CLIENT (Automated Receipt)
        const msgToClient = {
            to: email,
            from: process.env.SENDGRID_FROM!,
            subject: `We've received your brief for ${brandName}`,
            text: `
Hi ${firstName},

Thank you for sharing your vision for ${brandName}. 

I have received your brief and I'm currently reviewing the details to prepare for our strategy session.

You will receive a calendar invitation for your requested slot (${restOfData.preferredDate || "date"} - ${restOfData.preferredTime || "time"}) within 24 hours.

Best,
Raj | Novembre
`,
        };

        // 3. Send Emails in Parallel
        await Promise.all([
            sgMail.send(msgToOwner),
            sgMail.send(msgToClient)
        ]);

        return NextResponse.json({ success: true, id: project.id });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}