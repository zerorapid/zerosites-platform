"use client";

import { useState } from "react";
import { 
  Plus, 
  Layout, 
  Globe, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Clock,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TEMPLATES = [
  { id: "agency", name: "Premium Agency", description: "Dark, sleek, and high-converting.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60" },
  { id: "cafe", name: "Modern Cafe", description: "Minimalist layout for food & beverage.", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60" },
  { id: "service", name: "Local Service", description: "Bold design for plumbers, electricians, etc.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [sites, setSites] = useState([
    { id: "1", name: "My First Site", repo: "my-first-site", domain: "site.github.io", published: true, lastDeployed: "2 hours ago" }
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-black italic text-sm">ZS</span>
            </div>
            <span className="font-black tracking-tight text-xl italic text-slate-900 uppercase">ZeroSites</span>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={<Layout className="w-4 h-4" />} label="My Sites" active />
            <SidebarItem icon={<Globe className="w-4 h-4" />} label="Domains" />
            <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pro Plan</span>
             </div>
             <p className="text-xs font-bold text-slate-600 mb-3 leading-relaxed">Upgrade for custom domains & analytics.</p>
             <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">Upgrade Now</button>
          </div>
          <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-500 font-bold transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Sites</h1>
            <p className="text-xs text-slate-400 font-medium">Manage your digital assets.</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/api/auth/github/login"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
            >
              <div className="w-2 h-2 bg-slate-400 rounded-full" />
              Connect GitHub
            </a>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20"
            >
              <Plus className="w-4 h-4" />
              Create New Site
            </button>
          </div>
        </header>

        <div className="p-10">
          {sites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sites.map(site => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <Layout className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No sites yet</h2>
              <p className="text-slate-400 max-w-sm mb-8">Launch your first website in seconds using our zero-cost hosting templates.</p>
              <button 
                onClick={() => setIsWizardOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Pick a Template
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Template Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsWizardOpen(false)} />
          <div className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Pick a Starting Point</h2>
                <p className="text-slate-400 font-medium">Select a template to build your empire.</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Plus className="w-5 h-5 rotate-45 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TEMPLATES.map(template => (
                  <div 
                    key={template.id} 
                    className="group cursor-pointer"
                    onClick={() => router.push(`/dashboard/create/${template.id}`)}
                  >
                    <div className="aspect-[4/3] bg-slate-100 rounded-3xl mb-6 overflow-hidden relative border border-slate-200">
                      <img src={template.image} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                          Use Template <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
      active ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
    )}>
      {icon}
      {label}
    </button>
  );
}

function SiteCard({ site }: any) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(`/dashboard/editor/${site.id}`)}
      className="bg-white p-6 rounded-[32px] border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all group cursor-pointer"
    >
      <div className="aspect-video bg-slate-50 rounded-2xl mb-6 overflow-hidden relative border border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{site.name}</h3>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Globe className="w-3 h-3" />
            {site.domain}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{site.lastDeployed}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
