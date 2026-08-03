import React, { useState } from "react";
import { Settings, Globe, Bell, Sliders, Shield, Save, Eye, CheckCircle, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

export default function UserSettingsPage() {
  const [language, setLanguage] = useState("English (US)");
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [systemLogs, setSystemLogs] = useState(true);


  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Workspace preferences saved successfully!");
  };

  return (
    <div className="space-y-8  p-1 text-left relative">


      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit block">
              Workspace Environment Configuration
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
              System Settings
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Configure language specifications, platform telemetry, and active system notification alerts for GoChat AI.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Settings */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          {/* Section 1: Localization */}
          <div className="space-y-4">
            <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Localization</h4>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/40"
              >
                <option value="English (US)">English (US)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="French">Français (French)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="Japanese">日本語 (Japanese)</option>
              </select>
              <p className="text-[10px] text-zinc-500 leading-normal">Sets the display language throughout your dashboard and generated prompt summaries.</p>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alerts & Notifications</h4>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 bg-[#18181B]/40 border border-[#242424] rounded-xl">
                <div className="space-y-0.5 text-left">
                  <h5 className="text-xs font-bold text-white">Browser Notifications</h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">Push notification alerts on completed video renders.</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowNotifications}
                  onChange={(e) => setAllowNotifications(e.target.checked)}
                  className="w-4 h-4 rounded border-[#242424] text-amber-500 bg-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#18181B]/40 border border-[#242424] rounded-xl">
                <div className="space-y-0.5 text-left">
                  <h5 className="text-xs font-bold text-white">Email Billing Reports</h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">Weekly invoice logs sent to your verified identity.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-[#242424] text-amber-500 bg-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Logging</h4>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 bg-[#18181B]/40 border border-[#242424] rounded-xl">
                <div className="space-y-0.5 text-left">
                  <h5 className="text-xs font-bold text-white">Share Session Telemetry</h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">Anonymously stream error reports to help us optimize the platform.</p>
                </div>
                <input
                  type="checkbox"
                  checked={telemetry}
                  onChange={(e) => setTelemetry(e.target.checked)}
                  className="w-4 h-4 rounded border-[#242424] text-amber-500 bg-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#18181B]/40 border border-[#242424] rounded-xl">
                <div className="space-y-0.5 text-left">
                  <h5 className="text-xs font-bold text-white">Save History Ledger</h5>
                  <p className="text-[10px] text-zinc-500 leading-normal">Enables locally cached logs of past chat parameters.</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemLogs}
                  onChange={(e) => setSystemLogs(e.target.checked)}
                  className="w-4 h-4 rounded border-[#242424] text-amber-500 bg-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Workspace Settings
            </button>
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Device Node Details</h4>
          </div>

          <div className="space-y-4 text-left">
            <div className="p-3.5 bg-zinc-900/60 border border-[#242424] rounded-xl text-xs space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Environment IP</span>
              <p className="font-mono text-zinc-300 font-bold">192.168.1.1</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-[#242424] rounded-xl text-xs space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Browser Host</span>
              <p className="font-mono text-zinc-300 font-bold">Chrome Sandbox v123</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-[#242424] rounded-xl text-xs space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Location Node</span>
              <p className="font-mono text-zinc-300 font-bold">Mumbai Ingress Server</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
