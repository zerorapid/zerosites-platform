"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  Rocket, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Phone, 
  MapPin, 
  Plus,
  Loader2,
  Check,
  Eye,
  Monitor,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Local state for the site configuration
  const [config, setConfig] = useState({
    name: "Loading...",
    content: {
      headline: "The Best Business in Town",
      subheadline: "We provide high-quality services for our local community.",
      about: "Founded in 2024, we've been dedicated to excellence in everything we do.",
      services: [
        { title: "Service One", description: "Details about your first amazing service." },
        { title: "Service Two", description: "Details about your second amazing service." },
      ],
      contact: {
        email: "hello@business.com",
        phone: "+1 234 567 890",
        address: "123 Business St, City, Country"
      }
    }
  });

  const handleUpdateContent = (path: string, value: any) => {
    // Basic path-based update logic
    const newConfig = { ...config };
    const parts = path.split('.');
    let current: any = newConfig.content;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    
    setConfig(newConfig);
  };

  const [publishResult, setPublishResult] = useState<{ url: string } | null>(null);

  const handlePublish = async () => {
    if (!siteId) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/sites/publish/${siteId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publishing failed");
      setPublishResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Success Modal */}
      {publishResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <div className="relative bg-white w-full max-w-lg rounded-[40px] p-10 text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
               <Rocket className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Empire Launched!</h2>
              <p className="text-slate-500 font-medium">Your website is now live on the internet and hosted for free forever.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 truncate max-w-[200px]">{publishResult.url}</span>
              <a href={publishResult.url} target="_blank" className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                Visit Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <button 
              onClick={() => setPublishResult(null)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold"
            >
              Back to Editor
            </button>
          </div>
        </div>
      )}

      {/* Editor Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-black italic text-xs uppercase tracking-widest text-slate-400">Editing:</span>
            <span className="font-bold text-sm text-slate-900">{config.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewport("desktop")}
            className={cn("p-2 rounded-lg transition-all", viewport === "desktop" ? "bg-white shadow-sm text-slate-900" : "text-slate-400")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewport("mobile")}
            className={cn("p-2 rounded-lg transition-all", viewport === "mobile" ? "bg-white shadow-sm text-slate-900" : "text-slate-400")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 font-bold transition-colors text-sm">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {isPublishing ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Controls */}
        <aside className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-[#F8FAFC]">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Hero Section */}
            <EditorSection 
              id="hero" 
              title="Hero Section" 
              icon={<Layout className="w-4 h-4" />} 
              active={activeSection === "hero"}
              onClick={() => setActiveSection("hero")}
            >
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headline</label>
                  <textarea 
                    value={config.content.headline}
                    onChange={(e) => handleUpdateContent('headline', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none h-24 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-headline</label>
                  <textarea 
                    value={config.content.subheadline}
                    onChange={(e) => handleUpdateContent('subheadline', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none h-20 font-medium"
                  />
                </div>
              </div>
            </EditorSection>

            {/* About Section */}
            <EditorSection 
              id="about" 
              title="About Business" 
              icon={<Type className="w-4 h-4" />} 
              active={activeSection === "about"}
              onClick={() => setActiveSection("about")}
            >
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">About Our Story</label>
                  <textarea 
                    value={config.content.about}
                    onChange={(e) => handleUpdateContent('about', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none h-32 font-medium"
                  />
                </div>
              </div>
            </EditorSection>

            {/* Services Section */}
            <EditorSection 
              id="services" 
              title="Services" 
              icon={<Plus className="w-4 h-4" />} 
              active={activeSection === "services"}
              onClick={() => setActiveSection("services")}
            >
              <div className="space-y-4 pt-2">
                {config.content.services.map((service, index) => (
                  <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
                    <input 
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...config.content.services];
                        newServices[index].title = e.target.value;
                        handleUpdateContent('services', newServices);
                      }}
                      className="w-full text-sm font-bold border-none p-0 focus:ring-0"
                    />
                    <textarea 
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...config.content.services];
                        newServices[index].description = e.target.value;
                        handleUpdateContent('services', newServices);
                      }}
                      className="w-full text-xs text-slate-500 border-none p-0 focus:ring-0 resize-none h-16"
                    />
                  </div>
                ))}
                <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">Add Service</button>
              </div>
            </EditorSection>

            {/* Contact Section */}
            <EditorSection 
              id="contact" 
              title="Contact Info" 
              icon={<Phone className="w-4 h-4" />} 
              active={activeSection === "contact"}
              onClick={() => setActiveSection("contact")}
            >
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
                  <input 
                    value={config.content.contact.email}
                    onChange={(e) => handleUpdateContent('contact.email', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                  <input 
                    value={config.content.contact.phone}
                    onChange={(e) => handleUpdateContent('contact.phone', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>
            </EditorSection>
          </div>
        </aside>

        {/* Right: Live Preview */}
        <main className="flex-1 bg-slate-200 flex items-center justify-center p-8 overflow-hidden relative">
          <div 
            className={cn(
              "bg-white shadow-2xl transition-all duration-500 overflow-hidden relative",
              viewport === "desktop" ? "w-full h-full rounded-[32px]" : "w-[375px] h-[750px] rounded-[48px] border-[8px] border-slate-900"
            )}
          >
            {/* Actual Website Preview Content */}
            <div className="h-full overflow-y-auto bg-white scroll-smooth">
              {/* Preview Hero */}
              <section className="min-h-[500px] flex flex-col items-center justify-center text-center p-10 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                    {config.content.headline}
                  </h1>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    {config.content.subheadline}
                  </p>
                  <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold">Get Started Today</button>
                </div>
              </section>

              {/* Preview About */}
              <section className="py-20 px-10 max-w-4xl mx-auto">
                <h2 className="text-3xl font-black tracking-tight mb-8">About Our Story</h2>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  {config.content.about}
                </p>
              </section>

              {/* Preview Services */}
              <section className="py-20 px-10 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-black tracking-tight mb-12">Our Services</h2>
                  <div className="grid grid-cols-2 gap-8">
                    {config.content.services.map((service, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Preview Contact */}
              <section className="py-20 px-10 text-center">
                <h2 className="text-3xl font-black tracking-tight mb-12">Get in Touch</h2>
                <div className="flex flex-col items-center gap-4 text-slate-600 font-bold">
                  <p>{config.content.contact.email}</p>
                  <p>{config.content.contact.phone}</p>
                  <p className="text-slate-400 text-sm mt-4 italic font-medium">Built with ZeroSites</p>
                </div>
              </section>
            </div>

            {/* Mobile status bar mockup */}
            {viewport === "mobile" && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 flex items-center justify-between px-6">
                <div className="text-[10px] text-white font-bold uppercase">9:41</div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                  <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                  <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
             <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-xl text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Preview Engine Active</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function EditorSection({ id, title, icon, active, onClick, children }: any) {
  return (
    <div className={cn(
      "rounded-[24px] transition-all overflow-hidden",
      active ? "bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6" : "p-4 hover:bg-slate-200/50 cursor-pointer"
    )} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", active ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400")}>
            {icon}
          </div>
          <h3 className={cn("font-bold text-sm", active ? "text-slate-900" : "text-slate-400")}>{title}</h3>
        </div>
        {!active && <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
      </div>
      {active && children}
    </div>
  );
}
