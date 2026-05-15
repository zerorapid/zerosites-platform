import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://github.com/login/oauth/authorize";
  
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/api/auth/github/callback",
    scope: "public_repo read:user",
    state: Math.random().toString(36).substring(7), // Basic state for CSRF
  };

  const qs = new URLSearchParams(options).toString();

  return NextResponse.redirect(`${rootUrl}?${qs}`);
}
