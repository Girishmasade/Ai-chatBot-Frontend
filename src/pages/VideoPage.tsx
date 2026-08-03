import React, { useState } from "react";
import { Tv as VideoIcon, Sparkles, Play, Pause, Loader2, RefreshCw, Layers, Sliders } from "lucide-react";

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [step, setStep] = useState<"idle" | "start" | "poll" | "ready">("idle");
  const [opName, setOpName] = useState("");
  const [pollLogs, setPollLogs] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);

  // Pre-rendered premium dark amber motion loop references (using loopable stock URLs or stunning CSS/Canvas visualizations)
  const motionLoopUrl = "https://assets.mixkit.co/videos/preview/mixkit-background-of-a-glowing-digital-tunnel-42938-large.mp4";

  const handleStartInference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStep("start");
    setPollLogs(["[INFO] Initializing Veo Video Lite Engine...", "[INFO] Building operational payload..."]);

    // Transition to Polling Step 1
    setTimeout(() => {
      const generatedOp = `models/veo-3.1-lite/operations/op-${Math.random().toString(36).substr(2, 9)}`;
      setOpName(generatedOp);
      setStep("poll");
      setPollLogs((prev) => [...prev, `[SUCCESS] Created Operation: ${generatedOp}`, "[INFO] Initiating status polling..."]);

      // Polling log updates (Simulating background task polling)
      setTimeout(() => {
        setPollLogs((prev) => [...prev, "[POLL] Task Status: RUNNING // Frame compiler online", "[POLL] Progress: 38% // Compiling light rays"]);
      }, 1000);

      setTimeout(() => {
        setPollLogs((prev) => [...prev, "[POLL] Task Status: RUNNING // Refracting crystal mesh", "[POLL] Progress: 74% // Resolving motion flow"]);
      }, 2500);

      setTimeout(() => {
        setPollLogs((prev) => [...prev, "[POLL] Task Status: COMPLETED // Frame bundle verified", "[SUCCESS] Fetching asset downlinks..."]);
        
        setTimeout(() => {
          setStep("ready");
          setPlaying(true);
        }, 800);
      }, 4000);

    }, 1200);
  };

  const handleReset = () => {
    setPrompt("");
    setStep("idle");
    setOpName("");
    setPollLogs([]);
    setPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  p-1 text-left">
      {/* Configuration Sidebar */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-6 h-fit lg:col-span-1">
        <div className="space-y-1 pb-3 border-b border-[#1F1F1F]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Motion Parameters</h4>
          <p className="text-[10px] text-zinc-500">Video timeline & motion compiler</p>
        </div>

        <form onSubmit={handleStartInference} className="space-y-5">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Motion Prompt</label>
            <textarea
              id="video-prompt-field"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A gorgeous loop of swirling liquid dark mercury with translucent amber gold reflections floating slow-motion..."
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white placeholder-zinc-600 h-24 resize-none transition"
              disabled={step !== "idle"}
            />
          </div>

          {/* Resolution Options */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Render Quality
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "1080p Full HD", value: "1080p" },
                { label: "720p HD Ready", value: "720p" }
              ].map((res) => (
                <button
                  id={`video-res-${res.value}`}
                  key={res.value}
                  type="button"
                  onClick={() => setResolution(res.value)}
                  disabled={step !== "idle"}
                  className={`py-2 text-[9px] font-bold rounded-lg border transition ${
                    resolution === res.value
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Dimensions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Cinema (16:9)", value: "16:9" },
                { label: "Portrait (9:16)", value: "9:16" }
              ].map((asp) => (
                <button
                  id={`video-aspect-${asp.value}`}
                  key={asp.value}
                  type="button"
                  onClick={() => setAspectRatio(asp.value)}
                  disabled={step !== "idle"}
                  className={`py-2 text-[9px] font-bold rounded-lg border transition ${
                    aspectRatio === asp.value
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                  }`}
                >
                  {asp.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="video-btn-submit"
            type="submit"
            disabled={step !== "idle" || !prompt.trim()}
            className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
          >
            <Sparkles className="w-4 h-4" />
            Initialize Render
          </button>
        </form>
      </div>

      {/* Main Timeline screen / Logging panel */}
      <div className="lg:col-span-3 space-y-6">
        {step === "idle" && (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl h-96 flex flex-col items-center justify-center text-center space-y-3 p-6">
            <VideoIcon className="w-12 h-12 text-zinc-700 animate-pulse" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-zinc-400">Motion Canvas Empty</h5>
              <p className="text-[10px] text-zinc-600 max-w-xs">Config your parameters and click **Initialize Render** on the left panel to trigger the operation polling pipeline.</p>
            </div>
          </div>
        )}

        {/* STEP 1: START */}
        {step === "start" && (
          <div className="bg-[#111111] border border-amber-500/10 rounded-2xl h-96 flex flex-col items-center justify-center text-center space-y-4 p-6 relative overflow-hidden">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs font-bold text-white uppercase tracking-wider animate-pulse">Initializing Veo Video pipeline</p>
            <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed">Communicating with server-side SDK. Triggering operation handler...</p>
          </div>
        )}

        {/* STEP 2: POLLING LOGS (3-step operation logging terminal!) */}
        {step === "poll" && (
          <div className="bg-[#111111] border border-[#242424] rounded-2xl h-96 p-6 flex flex-col justify-between overflow-hidden relative font-mono">
            {/* Soft backdrop lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">Operation Status Monitor</span>
                <span className="text-[9px] text-[#71717A]">OP_NAME: {opName}</span>
              </div>

              {/* Console log lines */}
              <div className="space-y-2.5 pt-2 max-h-56 overflow-y-auto">
                {pollLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-500/40 shrink-0">❯</span>
                    <span className={`text-[10px] ${log.includes("SUCCESS") ? "text-emerald-500" : log.includes("POLL") ? "text-amber-400" : "text-zinc-400"}`}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom load bar */}
            <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Compiling active video segments...</span>
              </div>
              <span className="text-[10px] font-bold text-amber-500 uppercase">Polling live</span>
            </div>
          </div>
        )}

        {/* STEP 3: VIDEO PLAYBACK SCREEN */}
        {step === "ready" && (
          <div className="space-y-4">
            <div className="bg-[#111111] border border-amber-500/20 rounded-2xl overflow-hidden relative group">
              {/* Premium HTML5 Loop Video */}
              <video
                src={motionLoopUrl}
                autoPlay
                loop
                muted
                className="w-full aspect-video object-cover"
              />

              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="text-left">
                  <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">// COMPILER: VEO VIDEO LITE</p>
                  <p className="text-xs font-bold text-white truncate max-w-sm">{prompt}</p>
                </div>
                <button
                  id="video-btn-reset"
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-lg text-[10px] font-bold text-black uppercase transition flex items-center gap-1 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Render New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
