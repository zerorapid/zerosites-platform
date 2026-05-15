"use client";

import Link from "next/link";
import { Rocket, Zap, Shield, Globe, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span>ZeroSites</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
          <Link 
            href="/login" 
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-slate-200"
          >
            Start Building
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
              <Zap className="w-4 h-4 fill-current" />
              Revolutionary Website Hosting
            </div>
            <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Host Your Business <span className="text-indigo-600">Zero Cost.</span> Forever.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              ZeroSites turns your GitHub account into a powerful web hosting engine. Build, publish, and host professional landing pages without paying a single dollar in monthly fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/login" 
                className="bg-indigo-600 text-white px-8 py-5 rounded-[24px] text-lg font-black hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-200"
              >
                Launch Your Site Free <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3 px-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold">400+ Business Owners</div>
                  <div className="text-slate-500">already switched to ZeroSites</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-900 rounded-[48px] p-4 shadow-2xl border border-white/10">
                <div className="bg-slate-800 rounded-[32px] overflow-hidden aspect-video border border-white/5">
                   {/* Placeholder for Editor Preview */}
                   <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 w-full max-w-md">
                         <div className="h-4 w-1/2 bg-white/40 rounded-full mb-4"></div>
                         <div className="h-4 w-full bg-white/20 rounded-full mb-2"></div>
                         <div className="h-4 w-full bg-white/20 rounded-full mb-2"></div>
                         <div className="h-10 w-1/3 bg-indigo-500 rounded-xl mt-6"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-48">
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="Secure by Default"
            description="Hosted on GitHub's global infrastructure. Zero server downtime and enterprise-grade security."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6" />}
            title="Custom Domains"
            description="Easily connect your own domain (e.g. yourbusiness.com) with one click in the dashboard."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Blazing Fast"
            description="Static sites load 10x faster than WordPress. Better SEO, better conversions, better results."
          />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Rocket className="text-indigo-600 w-5 h-5" />
          <span>ZeroSites</span>
        </div>
        <div className="text-slate-500 text-sm">
          © 2026 ZeroSites Platform. Powered by GitHub Pages.
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <Globe className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mt-6 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
