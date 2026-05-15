"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Rocket, Layout, Globe, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = {
  agency: { name: "Premium Agency", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60" },
  cafe: { name: "Modern Cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60" },
  service: { name: "Local Service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60" },
};

export default function CreateSitePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as keyof typeof TEMPLATES;
  const template = TEMPLATES[templateId];

  const [name, setName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRepoNameChange = (val: string) => {
    // Sanitize for GitHub repo name
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    setRepoName(sanitized);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sites/create", {
        method: "POST",
        body: JSON.stringify({ name, repoName, templateId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      router.push(`/dashboard/editor/${data.site.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!template) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-400">Loading template...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Templates
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-black italic text-xs">ZS</span>
            </div>
            <span className="font-black text-sm uppercase italic tracking-widest text-slate-900">ZeroSites Builder</span>
        </div>
        <div className="w-32" /> {/* Spacer */}
      </header>

      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Form */}
        <div className="space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              Step 2 of 3
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Finalize your project details</h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              We'll use these details to set up your repository and initialize your professional business website.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
                  Business / Site Name
                </label>
                <div className="relative">
                   <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!repoName) handleRepoNameChange(e.target.value);
                    }}
                    placeholder="e.g. The Morning Cafe"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
                  GitHub Repository Name
                </label>
                <div className="relative">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input
                    type="text"
                    required
                    value={repoName}
                    onChange={(e) => handleRepoNameChange(e.target.value)}
                    placeholder="e.g. morning-cafe-site"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-1 italic">
                  This will be created at: <span className="text-slate-600 font-bold">github.com/your-username/{repoName || "..."}</span>
                </p>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              disabled={loading || !name || !repoName}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Build My Empire
                  <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
             <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900">Free Hosting Forever</p>
                  <p className="text-slate-500 text-xs mt-1">Deployed directly to GitHub Pages with zero monthly costs.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Preview Card */}
        <div className="sticky top-32">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[44px] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white p-4 rounded-[40px] border border-slate-100 shadow-2xl">
               <div className="aspect-[4/5] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-50 relative">
                  <img src={template.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                     <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Selected Style</p>
                     <h3 className="text-white text-2xl font-black italic tracking-tight">{template.name}</h3>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
