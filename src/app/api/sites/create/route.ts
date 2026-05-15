import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, repoName, templateId } = await req.json();

    // 1. Get current user
    const cookieStore = await cookies();
    const userId = cookieStore.get("sb-access-token")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input
    if (!name || !repoName || !templateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Create the site entry in Supabase
    // We'll use a default config based on the templateId
    const defaultConfig = {
      theme: templateId,
      content: {
        headline: name,
        description: "Welcome to our new business website.",
        heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
        contactEmail: "",
        phoneNumber: "",
        address: "",
      }
    };

    const { data, error } = await supabase
      .from("sites")
      .insert({
        user_id: userId,
        repo_name: repoName,
        config: defaultConfig,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ site: data });

  } catch (error: any) {
    console.error("Site creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
