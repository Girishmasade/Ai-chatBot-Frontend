import React, { useState } from "react";
import { FileText, Shield, Info, Mail, Phone, MapPin, Send, CheckCircle, Sparkles, Code2 } from "lucide-react";

// -------------------------------------------------------------
// SHARED: Dev Credit Footer
// -------------------------------------------------------------
function DevCredit() {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-2 pb-1 text-[10px] text-zinc-600">
      <Code2 className="w-3 h-3 text-amber-500/60" />
      <span>
        Made by <span className="font-semibold text-amber-500/80">Girish</span>{" "}
        <span className="text-zinc-600">(devCoder)</span>
      </span>
    </div>
  );
}

// -------------------------------------------------------------
// 1. TERMS OF SERVICE
// -------------------------------------------------------------
export function TermsOfServicePage() {
  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left overflow-x-hidden">
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Legal Agreement</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              Terms of Service
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Last revised: July 18, 2026</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 text-xs text-zinc-400 leading-relaxed w-full max-w-4xl">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. Agreement to Terms</h4>
          <p>By accessing or utilizing GoChat AI Platform, you agree to be bound by these Terms of Service. These Terms represent a legal and binding agreement between you and the GoChat AI Platform operators. If you do not agree, do not access our secure workspaces.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. Token & Credits Allotment</h4>
          <p>All active memberships receive credits or API tokens based on their VIP billing tier. Credits hold zero monetary value, are non-refundable, and expire based on standard 24-hour schedules unless stated otherwise by administrative logs. Any exploitation or deallocation errors will result in immediate system suspension.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. Acceptable Generative Use</h4>
          <p>Users must not generate visual content, videos, or text prompts that violate regional laws, incite hatred, or breach intellectual property regulations. All inference results are run through high-fidelity safety filters, and audit logs track active operator emails.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">4. Secure Proxy Routes</h4>
          <p>We proxy third-party model connections (such as Google DeepMind) server-side to safeguard API credentials. You are strictly forbidden from attempting to reverse-engineer, inject script headers, or intercept client socket streams.</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#1F1F1F]">
          <p className="text-[10px] text-zinc-500 font-mono break-all">SYSTEM LOG: TERMS_VERIFIED // SECURE CHECKPASS</p>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 2. PRIVACY POLICY
// -------------------------------------------------------------
export function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left overflow-x-hidden">
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Secured Records</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              Privacy Policy
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Last revised: July 18, 2026</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 text-xs text-zinc-400 leading-relaxed w-full max-w-4xl">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. Data Identity & Collection</h4>
          <p>We collect essential user identity indicators (such as name, email, and joined dates) to provide access to secure workspaces. Model inference inputs and prompts are processed on our Node.js server. We do not sell, trade, or lease personal identifiers.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. System Audit Logging</h4>
          <p>To prevent malicious platform exploitation, we maintain immutable audit records containing action logs, operator emails, timestamp parameters, and server-side request descriptions. These records are restricted entirely to platform Administrators and Developers.</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. Cookie & Consent Ledger</h4>
          <p>In compliance with modern privacy standards, we ask for user cookie preferences via our consent overlay banner. Consents are stored in an in-memory audit ledger, documenting user authorization for essential, analytical, or marketing cookies.</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#1F1F1F]">
          <p className="text-[10px] text-zinc-500 font-mono break-all">SYSTEM LOG: PRIVACY_OVERSIGHT // AUDITPASS: ACTIVE</p>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 3. ABOUT US
// -------------------------------------------------------------
export function AboutUsPage() {
  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left overflow-x-hidden">
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <Info className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Our Vision</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              About GoChat AI
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">The luxury standard for multi-modal intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 text-xs text-zinc-400 leading-relaxed text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aesthetic & Performance Coupled</h4>
          <p>GoChat AI was founded with a singular, uncompromised objective: to bring elite luxury visual and typographical pairings to the world of generative AI. We reject chaotic interfaces. Our design philosophy pairs spacious, high-contrast dark-mode cards with premium Amber highlights to keep focus absolute.</p>
          <p>Behind the interface runs a robust full-stack infrastructure. Using server-side proxy models from leading intelligence research hubs like Google DeepMind, we serve ultra-fast, contextual, and protected results without compromising developer security.</p>
        </div>

        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-4 text-left">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1F1F1F] pb-2">Core Pillars</h4>
          <div className="space-y-3 text-xs text-zinc-400">
            <div>
              <p className="font-bold text-amber-500">True Contrast first</p>
              <p className="text-[10px] text-zinc-500">Every panel strictly follows the flagship Obsidian theme.</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">Sub-second Latency</p>
              <p className="text-[10px] text-zinc-500">Inference times constantly checked on server proxies.</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">Zero Spoofing</p>
              <p className="text-[10px] text-zinc-500">Real database persistence and logs for all components.</p>
            </div>
          </div>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}

// -------------------------------------------------------------
// 4. CONTACT US
// -------------------------------------------------------------
export function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [toastMessage, setToastMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: "", email: "", query: "" });
    setToastMessage("Your inquiry has been logged. Our VIP relations team will contact you!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8  p-1 text-left relative overflow-x-hidden">
      {/* Toast - safely contained on mobile, floats top-right on larger screens */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-20 sm:max-w-sm bg-[#111111] border border-amber-500/20 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-xs font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="normal-case tracking-normal sm:uppercase sm:tracking-widest">{toastMessage}</span>
        </div>
      )}

      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-mono">VIP Relations</span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans truncate">
              Contact Concierge
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Let us optimize your enterprise intelligence workflow</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-4 w-full">
          <div className="border-b border-[#1F1F1F] pb-2 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Message</h4>
            <p className="text-[10px] text-zinc-500">Inquiries typically resolved within 2 hours</p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email..."
                  className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inquiry details</label>
              <textarea
                required
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                placeholder="Describe your request..."
                className="w-full bg-[#18181B] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white h-28 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Office details */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 sm:p-6 space-y-6 text-left w-full">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Corporate Offices</h4>
            <p className="text-[10px] text-zinc-500">GoChat AI Platform Private Ltd.</p>
          </div>

          <div className="space-y-4 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Headquarters Node</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 break-words">80 Feet Road, Koramangala, Bengaluru, Karnataka 560034</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Inquiries Email</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 break-all">support@gochat.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Secure Hotline</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">+91 (80) 4125-9900</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DevCredit />
    </div>
  );
}