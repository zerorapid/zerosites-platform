import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request, { params }: { params: { siteId: string } }) {
  try {
    const siteId = params.siteId;

    // 1. Get current user & site config
    const cookieStore = await cookies();
    const userId = cookieStore.get("sb-access-token")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId)
      .eq("user_id", userId)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // 2. Get User's GitHub Token
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("github_token")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.github_token) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
    }

    const ghToken = profile.github_token;
    const repoName = site.repo_name;
    const templateId = site.config.theme; // agency, cafe, service

    // 3. Create Repo from Template (if it doesn't exist)
    const checkRepo = await fetch(`https://api.github.com/repos/${site.github_username}/${repoName}`, {
      headers: { Authorization: `token ${ghToken}` }
    });

    if (checkRepo.status === 404) {
      // Create from template
      const createRes = await fetch(`https://api.github.com/repos/zerorapid/zerosites-template-${templateId}/generate`, {
        method: "POST",
        headers: {
          Authorization: `token ${ghToken}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          name: repoName,
          description: "My ZeroSites Landing Page",
          include_all_branches: false,
          private: false
        }),
      });
      if (!createRes.ok) throw new Error("Failed to create repo from template");
      
      // Wait a few seconds for GitHub to initialize the repo
      await new Promise(r => setTimeout(r, 3000));
    }

    // 4. Push the custom content.json
    const getGHUser = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${ghToken}` }
    });
    const ghUser = await getGHUser.json();
    const owner = ghUser.login;

    const contentUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/content.json`;
    
    // Get SHA of current content.json
    const getFile = await fetch(contentUrl, {
      headers: { Authorization: `token ${ghToken}` }
    });
    const fileData = await getFile.json();

    const pushRes = await fetch(contentUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${ghToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update content via ZeroSites",
        content: Buffer.from(JSON.stringify(site.config, null, 2)).toString("base64"),
        sha: fileData.sha
      }),
    });

    if (!pushRes.ok) throw new Error("Failed to push content to GitHub");

    // 5. Enable GitHub Pages
    await fetch(`https://api.github.com/repos/${owner}/${repoName}/pages`, {
      method: "POST",
      headers: {
        Authorization: `token ${ghToken}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        source: { branch: "main", path: "/" }
      }),
    });

    // 6. Update local DB
    await supabase.from("sites").update({ 
      is_published: true, 
      last_deployed: new Date().toISOString() 
    }).eq("id", siteId);

    return NextResponse.json({ 
      message: "Published successfully", 
      url: `https://${owner}.github.io/${repoName}/` 
    });

  } catch (error: any) {
    console.error("Publishing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
