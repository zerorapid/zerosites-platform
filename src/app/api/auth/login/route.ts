import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // --- TEST BYPASS FOR DEVELOPMENT ---
    if (email === "test@zerorapid.in") {
      await supabase.from("auth_tokens").insert({
        email,
        token: "123456",
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });
      return NextResponse.json({ message: "Test mode: Use 123456" });
    }
    // ------------------------------------

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: dbError } = await supabase.from("auth_tokens").insert({
      email,
      token: otp,
      expires_at: expiresAt.toISOString(),
    });

    if (dbError) throw dbError;

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "ZeroSites <onboarding@resend.dev>",
      to: email,
      subject: "Your ZeroSites Login Code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Welcome to ZeroSites</h2>
          <p style="color: #666;">Your login code is:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; color: #000;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
          <p style="color: #ccc; font-size: 10px;">If this doesn't work, ensure your Resend key is active.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend specific error:", emailError);
      return NextResponse.json({ 
        error: "Failed to send email. Check if your Resend domain is verified or if you've hit your limit.",
        details: emailError
      }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
