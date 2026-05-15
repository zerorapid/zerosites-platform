import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect("http://localhost:3000/dashboard?error=github_auth_failed");
    }

    // 1. Get the current user from our session cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get("sb-access-token")?.value;

    if (!userId) {
      return NextResponse.redirect("http://localhost:3000/login?error=session_expired");
    }

    // 2. Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Failed to get GitHub access token");
    }

    // 3. Get GitHub user info (to get their avatar/name)
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const ghUser = await userRes.json();

    // 4. Update Profile in Supabase with the token and GH info
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        github_token: accessToken, // In production, encrypt this!
        full_name: ghUser.name || ghUser.login,
        avatar_url: ghUser.avatar_url,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 5. Success! Redirect to dashboard
    return NextResponse.redirect("http://localhost:3000/dashboard?success=github_connected");

  } catch (error: any) {
    console.error("GitHub Callback error:", error);
    return NextResponse.redirect(`http://localhost:3000/dashboard?error=${encodeURIComponent(error.message)}`);
  }
}
