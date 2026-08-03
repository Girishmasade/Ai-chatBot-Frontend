import React, { useState } from "react";
import { Bell, Search, Award, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { ActiveScreen, User } from "../types";
import { useGetLogsQuery } from "../redux/api/apiSlice";

interface AppTopBarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  currentUser: User;
  onRefreshCredits?: () => void;
}

export default function AppTopBar({
  activeScreen,
  setActiveScreen,
  currentUser,
  onRefreshCredits
}: AppTopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive Screen Readable Name
  const getScreenName = () => {
    switch (activeScreen) {
      case "dashboard":
        return "Intelligence Overview";
      case "chat":
        return "Conversational Chat Core";
      case "image":
        return "High-Fidelity Image Studio";
      case "video":
        return "Motion Simulation Room";
      case "prompt-studio":
        return "Elite Prompt Synthesizer";
      case "models-list":
        return "Available Model Engines";
      case "assets-library":
        return "My Generative Assets";
      case "business-plan":
        return "AI Venture Capital Strategy";
      case "subscription":
        return "Luxury VIP Access Plans";
      case "settings":
        return "Workspace Configuration";
      case "profile":
        return "Account Settings";
      case "admin":
        return "System Central Control Room";
      case "terms":
        return "Terms of Service";
      case "privacy":
        return "Privacy Policy";
      case "about":
        return "About GoChat AI";
      case "contact":
        return "VIP Relations Concierge";
      default:
        return "Workspace";
    }
  };

  const isAdmin = currentUser.role === "Administrator" || currentUser.role === "admin";
  const { data: logsData } = useGetLogsQuery(undefined, { skip: !isAdmin });

  const dynamicNotifications = React.useMemo(() => {
    if (isAdmin && logsData) {
      // RTK Query might return the raw response { data: [...] } instead of the array directly
      const logsArray = Array.isArray(logsData) ? logsData : ((logsData as any).data || []);
      return logsArray.slice(0, 10).map((log: any) => ({
        id: log.id,
        title: log.action,
        details: log.details,
        time: log.timestamp,
        read: false
      }));
    }
    return [
      { id: 1, title: "Pro membership active", details: "Welcome to GoChat AI Platform", time: "Just now", read: false },
      { id: 2, title: "Initial 200 Tokens Granted", details: "Fresh registration wallet loaded", time: "Today", read: true }
    ];
  }, [currentUser.role, logsData]);

  return (
    <header className="h-16 border-b border-[#242424] bg-[#090909]/80 backdrop-blur-md px-6 flex items-center justify-between  z-10 sticky top-0">
      {/* Left Title and Status */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xs font-semibold text-white tracking-wider flex items-center gap-1.5 uppercase">
            {getScreenName()}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-[#71717A] tracking-widest uppercase font-semibold">
              Live server link established
            </span>
          </div>
        </div>

        {/* Admin Quick Back Action */}
        {activeScreen === "admin" && (
          <button
            id="topbar-btn-user-mode"
            onClick={() => setActiveScreen("dashboard")}
            className="ml-4 px-2.5 py-1 text-[10px] font-bold text-amber-500 hover:text-black bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 rounded-md flex items-center gap-1 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Switch to User View
          </button>
        )}
      </div>

      {/* Right Tools & Credits counter */}
      <div className="flex items-center gap-5">
        {/* Credits Counter Panel (Interface Balance - Only shown on user side for non-admin users) */}
        {!isAdmin && activeScreen !== "admin" && (
          <div
            id="topbar-interface-balance"
            onClick={() => setActiveScreen("subscription")}
            className="bg-[#111111] border border-[#242424] rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-500/30 transition group"
          >
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-500">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-[8px] uppercase tracking-wider text-[#71717A] font-bold leading-none">
                Interface Balance
              </p>
              <p className="text-xs font-bold text-white leading-tight font-numbers mt-0.5 flex items-center gap-1">
                {(currentUser.credits || 200).toLocaleString()} <span className="text-[10px] text-amber-500/80">tokens</span>
              </p>
            </div>
            {onRefreshCredits && (
              <button
                id="topbar-btn-refresh"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshCredits();
                }}
                className="p-1 rounded text-zinc-500 hover:text-white transition hover:bg-zinc-900 ml-1"
              >
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition duration-500" />
              </button>
            )}
          </div>
        )}

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            id="topbar-btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#111111] border border-[#242424] text-zinc-400 hover:text-white hover:border-zinc-700 transition relative"
          >
            <Bell className="w-4 h-4" />
            {dynamicNotifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Popover */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-[#111111] border border-[#242424] rounded-2xl p-4 shadow-2xl z-30">
                <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAdmin ? "System Audit Alerts" : "Notifications"}
                  </h4>
                  <span className="text-[9px] text-amber-500 font-semibold uppercase">
                    {dynamicNotifications.length} Events Logged
                  </span>
                </div>
                <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto">
                  {dynamicNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition ${
                        n.read ? "bg-transparent border-transparent" : "bg-amber-500/5 border-amber-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold text-zinc-200">{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />}
                      </div>
                      {n.details && <p className="text-[10px] text-zinc-400 mt-0.5">{n.details}</p>}
                      <span className="text-[9px] text-zinc-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Hub Badge */}
        <div
          onClick={() => setActiveScreen("profile")}
          className="flex items-center gap-2 cursor-pointer border border-transparent hover:border-amber-500/20 px-1.5 py-1 rounded-xl transition"
        >
          <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#242424] flex items-center justify-center font-bold text-xs text-amber-500">
            {currentUser.name[0]}
          </div>
          <span className="text-xs text-zinc-300 font-medium max-w-[80px] truncate hidden sm:inline-block">
            {currentUser.name.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
