
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
            businessStage,
            designPreferences,
            capabilities,
            launchTimeline,
            stackAlignment,
            successVision,
            preferredDate,
            preferredTime,
            timezone,
            ...restOfData
        } = body;

        // Calculate Intelligence Scores
        const urgencyScore = launchTimeline === "urgent" ? 10 :
            launchTimeline === "30_days" ? 7 :
                launchTimeline === "1_2_months" ? 5 : 2;

        // Count total selected capabilities
        const complexityScore = Object.values(capabilities || {}).flat().length;

        const budgetSignal = (Array.isArray(stackAlignment) && stackAlignment.includes("full_stack")) ? "high" :
                        (Array.isArray(stackAlignment) && stackAlignment.includes("growth_focused")) ? "medium-high" :
                        (Array.isArray(stackAlignment) && stackAlignment.length > 1) ? "medium" : "low";

        // Insert with enhanced metadata
        // We map 'brandName' to 'contact_name' basically, or we can just rely on brief_data for specifics.
        // The previous implementation mapped contact_name to cafeName. 
        // Here we'll map contact_name to firstName + brandName.

        const { data: project, error: dbError } = await supabase
            .from("projects")
            .insert([{
                contact_email: email || "unknown@example.com", // Fallback if missing
                contact_name: firstName || brandName || "Visionary",
                contact_phone: phoneNumber,
                project_type: "web_system",
                brief_data: {
                    // Core Intelligence
                    brandName,
                    businessStage,
                    designPreferences,
                    capabilities,
                    launchTimeline,
                    stackAlignment,
                    successVision,

                    // Scores
                    urgencyScore,
                    complexityScore,
                    budgetSignal,

                    // Call Info
                    preferredDate,
                    preferredTime,
                    timezone,

                    ...restOfData
                },
                // Call Scheduling columns if they exist in DB, otherwise they are in brief_data
                // previous code used call_scheduled_date, call_scheduled_time, call_timezone.
                // We will assume these columns exit.
                call_scheduled_date: preferredDate,
                call_scheduled_time: preferredTime,
                call_timezone: timezone,
                status: "pre_call_complete"
            }])
            .select()
            .single();

        if (dbError) {
            console.error("Supabase Error:", dbError);
            // Fallback: try inserting without specific call columns if that was the error, 
            // but for now we throw.
            throw dbError;
        }

        // Enhanced Email to Owner
        const msgToOwner = {
            to: process.env.NOTIFY_EMAIL!,
            from: process.env.SENDGRID_FROM!,
            subject: `🎯 Pre-Call Intel: ${brandName} [${budgetSignal.toUpperCase()}]`,
            html: `
        <h2>Pre-Strategy Call Intelligence Report</h2>
        
        <h3>🎯 Quick Assessment</h3>
        <ul>
          <li><strong>Business Stage:</strong> ${businessStage}</li>
          <li><strong>Budget Signal:</strong> ${budgetSignal}</li>
          <li><strong>Urgency:</strong> ${launchTimeline} (Score: ${urgencyScore}/10)</li>
          <li><strong>Complexity:</strong> ${complexityScore} capabilities selected</li>
        </ul>
        
        <h3>💡 Strategic Intent</h3>
        <p><em>"${successVision}"</em></p>
        
        <h3>🎨 Design Direction</h3>
        <p>${(designPreferences || []).join(", ")}</p>
        
        <h3>📞 Call Scheduled</h3>
        <p>${preferredDate} at ${preferredTime} ${timezone}</p>
        
        <p><strong>Contact:</strong> ${firstName} (${email}, ${phoneNumber})</p>
      `
        };

        // Client Confirmation
        const stacksSelected = Array.isArray(stackAlignment) ? stackAlignment.join(", ") : stackAlignment;
        const msgToClient = {
            to: email,
            from: process.env.SENDGRID_FROM!,
            subject: `Your strategy session with Novembre is confirmed`,
            html: `
        <p>Hi ${firstName},</p>
        <p>Thank you for completing the pre-call brief for ${brandName}.</p>
        <p><strong>Your strategy session is scheduled for:</strong><br/>
        ${preferredDate} at ${preferredTime} ${timezone}</p>
        <p>I've reviewed your goals and the framework (${stacksSelected}) you selected. 
        I'll come prepared with a tailored strategy.</p>
        <p>See you soon,<br/>Raj | Novembre</p>
      `
        };

        // NOTE: Emails are commented out for now as requested.
        /*
        await Promise.all([
          sgMail.send(msgToOwner),
          sgMail.send(msgToClient)
        ]);
        */

        console.log("Brief submitted successfully. ID:", project.id);

        return NextResponse.json({
            success: true,
            id: project.id,
            message: "Pre-call intelligence captured successfully"
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}