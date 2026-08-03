import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Zap,
  Cpu,
  Lock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  FileText,
  MousePointer
} from "lucide-react";
import LuxuryOrb from "../components/LuxuryOrb";
import { ActiveScreen } from "../types";
import { useGetConfigQuery } from "../redux/api/apiSlice";

interface LandingPageProps {
  onEnterApp: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function LandingPage({ onEnterApp, setActiveScreen }: LandingPageProps) {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  // Stagger animation helpers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      {/* Background vector elements */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-amber-500/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Landing Navbar */}
      <nav className="border-b border-[#1F1F1F]/60 backdrop-blur-md sticky top-0 z-30 bg-[#090909]/80 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          {branding?.mainLogo || branding?.logoImage ? (
            <img 
              src={branding.mainLogo || branding.logoImage} 
              alt="Brand Logo" 
              className="h-8 max-w-[120px] object-contain" 
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-black font-black text-xs">GC</span>
            </div>
          )}
          <span className="text-sm font-bold tracking-wider text-white">
            {branding?.appName || branding?.logoName || "GoChat AI"}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs text-zinc-400 hover:text-white transition duration-200">Features</a>
          <a href="#luxury-design" className="text-xs text-zinc-400 hover:text-white transition duration-200">Design Pillars</a>
          <a href="#pricing" className="text-xs text-zinc-400 hover:text-white transition duration-200">Pricing</a>
        </div>

        <button
          id="landing-nav-btn-enter"
          onClick={onEnterApp}
          className="px-4 py-2 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition duration-250 flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
        >
          Enter Workspace
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-6 md:max-w-xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wider uppercase rounded-full"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            Ultimate Generation Platform
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1] font-sans"
          >
            The Luxury Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              For Generative AI
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm text-zinc-400 leading-relaxed max-w-lg"
          >
            Unlock elite conversational chat, custom asset curation, multi-format image creators, and venture-grade business strategy logs. Structured beautifully within a premier Black Amber signature dashboard.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              id="hero-btn-launch"
              onClick={onEnterApp}
              className="px-6 py-3.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/15"
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="px-6 py-3.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#111111] border border-[#242424] hover:border-zinc-700 rounded-xl transition flex items-center justify-center gap-2"
            >
              Explore Intelligence Features
            </a>
          </motion.div>

          {/* Key Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-[#1F1F1F]"
          >
            <div>
              <p className="text-lg font-bold text-white tracking-tight font-numbers">0.4s</p>
              <p className="text-[10px] text-[#71717A] uppercase font-semibold mt-1">Average Latency</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight font-numbers">₹1,499</p>
              <p className="text-[10px] text-[#71717A] uppercase font-semibold mt-1">Pro Tier Price</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight font-numbers">100%</p>
              <p className="text-[10px] text-[#71717A] uppercase font-semibold mt-1">Secure Server</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Orb Simulator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center relative min-h-[400px]"
        >
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.03] to-transparent blur-2xl pointer-events-none" />
          <LuxuryOrb size={360} />
          {/* Subtle metadata tags floating in the margin */}
          <div className="absolute top-10 right-4 p-2 bg-[#111111]/80 border border-[#242424] rounded-lg pointer-events-none text-[9px] font-mono text-[#71717A]">
            SYS_ORB_ACTIVE // ROTATE: TRUE
          </div>
          <div className="absolute bottom-10 left-4 p-2 bg-[#111111]/80 border border-[#242424] rounded-lg pointer-events-none text-[9px] font-mono text-[#71717A]">
            INF_LATENCY // 0.4s
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-[#0C0C0C] border-y border-[#1F1F1F]/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Workspace Suites</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              An Elite Generation Ecosystem
            </p>
            <p className="text-xs text-zinc-400">
              Each core utility is custom crafted to work harmoniously, styled in our flagship dark obsidian theme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#111111] border border-[#1F1F1F] p-7 rounded-2xl text-left space-y-4 hover:border-amber-500/20 transition duration-300">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Conversational Chat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly with Gemini to format advanced system reports, solve programmatic errors, or generate elite text logs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111111] border border-[#1F1F1F] p-7 rounded-2xl text-left space-y-4 hover:border-amber-500/20 transition duration-300">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Image Studio</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Render ultra-high definition visual graphics. Fully configurable aspect ratios, instant file downloads, and styled asset memory.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111111] border border-[#1F1F1F] p-7 rounded-2xl text-left space-y-4 hover:border-amber-500/20 transition duration-300">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-500">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Venture strategist</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate highly analytical strategic business plans. Compiles real market demographics, budgets, and operational timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Design Section */}
      <section id="luxury-design" className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Luxury Design Philosophy</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Obsidian Grayscale With Warm Amber highlights
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We reject chaotic multi-colored displays. GoChat AI strictly implements our elite *Black Amber* scheme, where beautiful near-black slate backgrounds pair with the rich, singular entry signature of pure warm gold indicators.
            </p>
            <div className="space-y-4 pt-3">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-amber-500/10 text-amber-500 mt-1">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Full Privacy Compliance</h4>
                  <p className="text-[11px] text-[#71717A]">Complete cookie preferences logging and robust admin oversight.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-amber-500/10 text-amber-500 mt-1">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Advanced Telemetry</h4>
                  <p className="text-[11px] text-[#71717A]">Server-side proxy routes shielding secret parameters.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-mono text-[#52525B] mb-4">// BRAND COLOR DEPLOYMENT</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#090909] border border-[#1F1F1F] rounded-xl">
                <span className="text-xs font-medium">Obsidian Base Black</span>
                <span className="text-xs font-mono text-zinc-500">#090909</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#151515] border border-[#1F1F1F] rounded-xl">
                <span className="text-xs font-medium">Obsidian Elevated Card</span>
                <span className="text-xs font-mono text-zinc-500">#151515</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                <span className="text-xs font-bold">Premium Accent Amber</span>
                <span className="text-xs font-mono font-bold">#F59E0B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CMS Section */}
      <footer className="border-t border-[#1F1F1F] bg-[#0C0C0C] py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center">
              <span className="text-black font-extrabold text-xs">GC</span>
            </div>
            <span className="text-xs text-zinc-500">
              © 2026 GoChat AI Platform. All rights to prestige reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span
              onClick={() => setActiveScreen("admin")}
              className="text-[10px] text-zinc-600 hover:text-amber-500 cursor-pointer uppercase tracking-wider font-bold transition"
            >
              System Controls
            </span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
              INR ₹ Currency Checked
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
