"use client";

import { useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email, token }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl shadow-slate-200/60 mb-6 border border-white">
            <span className="text-2xl font-black italic tracking-tighter text-slate-900">ZS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">ZeroSites</h1>
          <p className="text-slate-500 font-medium">Build your digital empire for free.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium px-1">{error}</p>}

              <button
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue with Email"}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xl tracking-[1em] text-center font-bold"
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Sent to <span className="text-slate-900 font-bold">{email}</span>
                </p>
              </div>

              {error && <p className="text-red-500 text-sm font-medium px-1 text-center">{error}</p>}

              <div className="space-y-3">
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 font-bold transition-colors"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center mt-10 text-sm text-slate-400 font-medium">
          New to ZeroSites? <span className="text-slate-900 font-bold underline cursor-pointer">Start building</span>
        </p>
      </div>
    </div>
  );
}
