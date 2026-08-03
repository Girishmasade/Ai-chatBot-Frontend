import React, { useState, useEffect } from "react";
import { Cpu, Zap, Star, ShieldCheck, Sparkles, TrendingUp, AlertCircle, HelpCircle } from "lucide-react";
import { SystemModel } from "../types";

import { useGetModelsQuery } from "../redux/api/apiSlice";

export default function ModelsListPage() {
  const { data: backendModels, isLoading: loading } = useGetModelsQuery();

  const models: SystemModel[] = backendModels && backendModels.length > 0
    ? backendModels
    : [
        {
          id: "m-1",
          name: "Gemini 1.5 Flash",
          version: "gemini-1.5-flash",
          type: "text",
          status: "active",
          latency: "230ms",
          description: "High-speed multimodal intelligence optimized for quick, cost-efficient chat and reasoning tasks."
        },
        {
          id: "m-2",
          name: "Gemini 1.5 Pro",
          version: "gemini-1.5-pro",
          type: "text",
          status: "active",
          latency: "680ms",
          description: "Maximum capability model for highly complex reasoning, advanced coding, and long-context analysis."
        },
        {
          id: "m-3",
          name: "Google Veo 2",
          version: "veo-2.0-generate",
          type: "video",
          status: "active",
          latency: "2.4s",
          description: "State-of-the-art video generation engine creating high-fidelity, cinema-grade motion loops."
        }
      ];

  // Map high fidelity logos and tags to mock providers
  const getProviderInfo = (version: string) => {
    if (version.startsWith("gemini")) {
      return { provider: "Google DeepMind", cost: "1 cr / query", tier: "Core Suite" };
    } else if (version.startsWith("veo")) {
      return { provider: "Google DeepMind (Veo)", cost: "5 cr / video", tier: "Motion Elite" };
    }
    return { provider: "GoChat AI Custom", cost: "2 cr / query", tier: "Beta Suite" };
  };

  return (
    <div className="space-y-8  p-1 text-left">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit block">
              Inference Hardware Pool
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
              Available AI Engines
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Inspect active model allocations and latency times routed through our secure Express gateway. Custom optimized for Black Amber sub-processors.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((m) => {
            const providerInfo = getProviderInfo(m.version);
            const isActive = m.status === "active";

            return (
              <div
                key={m.id}
                className={`bg-[#111111] border rounded-2xl p-6 relative flex flex-col justify-between transition group hover:border-zinc-700 ${
                  isActive ? "border-[#242424]" : "border-[#1F1F1F]/60 opacity-60"
                }`}
              >
                {/* Spotlight hover effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.01] group-hover:bg-amber-500/[0.03] blur-xl rounded-full transition-all duration-500 pointer-events-none" />

                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                      {m.type} Processor
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                        {isActive ? "Operational" : "Deallocated"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white group-hover:text-amber-500 transition">
                      {m.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {m.version}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="pt-2 grid grid-cols-2 gap-4 border-t border-[#1F1F1F]">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-[#71717A] font-bold">Provider Core</p>
                      <p className="text-[11px] font-semibold text-zinc-300 mt-0.5">{providerInfo.provider}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-[#71717A] font-bold">Credit Cost</p>
                      <p className="text-[11px] font-semibold text-amber-500 mt-0.5">{providerInfo.cost}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#71717A] font-mono">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500" /> Latency: {m.latency}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/5 text-amber-500 font-bold uppercase text-[9px] border border-amber-500/10">
                    {providerInfo.tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQs Panel */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
        <div className="border-b border-[#1F1F1F] pb-3 flex items-center gap-2 text-left mb-4">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Model Selection FAQ</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
          <div className="space-y-1">
            <h5 className="font-bold text-zinc-300">How is inference billed?</h5>
            <p className="text-zinc-500 leading-relaxed">Each API trigger debits a set amount of credits from your balance. Gemini Flash text queries cost 1 credit, while advanced Veo video frames cost 5 credits.</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-zinc-300">Are the models updated automatically?</h5>
            <p className="text-zinc-500 leading-relaxed">Yes. Our server-side Node.js environment automatically binds to the latest Gemini SDK endpoints, securing sub-second latencies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
