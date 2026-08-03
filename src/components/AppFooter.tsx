import React, { useState, useEffect } from "react";
import { ActiveScreen } from "../types";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  ArrowRight,
  Check,
  Code2
} from "lucide-react";
import { getStoredSocialLinks, PLATFORM_ICONS, SocialLinkItem } from "../helpers/socialLinks";

interface AppFooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  activeScreen: ActiveScreen;
}

export default function AppFooter({ setActiveScreen, activeScreen }: AppFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(getStoredSocialLinks());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setSocialLinks(e.detail);
      } else {
        setSocialLinks(getStoredSocialLinks());
      }
    };
    window.addEventListener("gochat_social_links_updated", handleUpdate);
    return () => {
      window.removeEventListener("gochat_social_links_updated", handleUpdate);
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <footer
      id="app-global-footer"
      className="w-full max-w-full bg-[#09090b] text-zinc-400 border-t border-[#1a1a1f]  text-left pt-12 sm:pt-16 pb-8 px-4 sm:px-6 md:px-12 mt-12 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-16">

          {/* Column 1: Brand details */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-amber-500/10 shrink-0">
                G
              </div>
              <span className="text-xl font-bold text-white tracking-tight">GoChat AI</span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Next-generation AI platform for chat, image, video, and asset generation. Built for creators and enterprises.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-zinc-400 min-w-0">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href="mailto:hello@gochat.ai" className="hover:text-white transition break-all">hello@gochat.ai</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400 min-w-0">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href="tel:+15550000000" className="hover:text-white transition">+1 (555) 000-0000</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400 min-w-0">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-5">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Quick Links
            </h5>
            <div className="flex flex-col space-y-3">
              {[
                { id: "about", label: "About" },
                { id: "privacy", label: "Privacy Policy" },
                { id: "terms", label: "Terms of Service" },
                { id: "contact", label: "Contact" }
              ].map((link) => (
                <button
                  id={`footer-link-${link.id}`}
                  key={link.id}
                  onClick={() => setActiveScreen(link.id as ActiveScreen)}
                  className={`text-sm text-zinc-400 hover:text-white transition text-left w-fit ${
                    activeScreen === link.id ? "text-[#F59E0B] font-medium" : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Stay Updated */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-5">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Stay Updated
            </h5>
            <p className="text-sm text-zinc-400">
              Get the latest AI features and updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 max-w-sm">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-[#121214] border border-[#242429] focus:border-[#F59E0B]/50 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 transition"
                  disabled={subscribed}
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="bg-[#F59E0B] hover:bg-amber-400 text-black rounded-lg px-4 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-amber-500 font-medium">
                  Successfully subscribed to GoChat newsletter!
                </p>
              )}
            </form>
          </div>

          {/* Column 4: Follow Us */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-5">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Follow Us
            </h5>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => {
                const IconComp = PLATFORM_ICONS[social.platform] || Globe;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#121214] border border-[#242429] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#F59E0B]/30 hover:bg-zinc-900 transition shrink-0"
                    title={social.label}
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-[#1a1a1f] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-zinc-500 text-center sm:text-left">
          <span>© 2026 GoChat AI. All rights reserved.</span>
          <span className="text-zinc-500 hover:text-zinc-400 transition cursor-pointer">
            Powered by GoChat AI
          </span>
        </div>

        {/* Dev credit */}
        <div className="flex items-center justify-center gap-1.5 pt-5 text-[10px] text-zinc-600">
          <Code2 className="w-3 h-3 text-amber-500/60" />
          <span>
            Made by <span className="font-semibold text-amber-500/80">Girish</span>{" "}
            <span className="text-zinc-600">(devCoder)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}