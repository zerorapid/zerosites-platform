import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "your-fallback-secret";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    // 1. Verify OTP
    const { data: tokenData, error: tokenError } = await supabase
      .from("auth_tokens")
      .select("*")
      .eq("email", email)
      .eq("token", token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // 2. Mark OTP as used
    await supabase.from("auth_tokens").update({ used: true }).eq("id", tokenData.id);

    // 3. Get or Create User in Supabase Auth
    // 3. Check if user exists in our profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    let user = profile;
    if (!user) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (createError) throw createError;
      user = newUser.user;
    }

    // 4. Create Profile if missing
    await supabase.from("profiles").upsert({ id: user.id }, { onConflict: 'id' });

    // 5. Generate a native Supabase session for the client
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: '/dashboard'
      }
    });

    if (sessionError) throw sessionError;

    // The user is now authenticated. In a real production app, we would 
    // redirect them to the hashed link in sessionData.properties.action_link
    // but for this MVP, we will issue a simple session cookie.
    
    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", sessionData.user?.id || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ 
      user: { id: user.id, email: user.email },
      message: "Login successful" 
    });

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
