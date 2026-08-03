import React, { useState } from "react";
import { Sparkles, Save, BookOpen, Star, Copy, Check, Trash2, Sliders, Palette, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface SavedPrompt {
  id: string;
  title: string;
  text: string;
  category: string;
  stars: boolean;
}

export default function PromptStudioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [promptInput, setPromptInput] = useState("");
  const [promptTitle, setPromptTitle] = useState("");
  const [selectedMood, setSelectedMood] = useState("Cinematic");
  const [selectedStyle, setSelectedStyle] = useState("3D Obsidian Glow");
  const [selectedLighting, setSelectedLighting] = useState("Dramatic Chiaroscuro");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([
    {
      id: "p-1",
      title: "Obsidian Liquid Mercury",
      text: "A floating obsidian sphere covered in liquid mercury waves, high-contrast, gold light rays piercing through dark glass panels, octane render, 8k resolution, cinematic.",
      category: "Image",
      stars: true
    },
    {
      id: "p-2",
      title: "Amber Prism Refraction",
      text: "A beautiful translucent amber crystal prism refracting volumetric laser beam onto an obsidian dark floor, cinematic lighting, ultra-realistic.",
      category: "Image",
      stars: true
    },
    {
      id: "p-3",
      title: "Interactive SaaS Dark Dashboard",
      text: "Design a futuristic executive dark mode SaaS control board. Emphasize Inter display typography paired with JetBrains Mono numbers, generous negative spacing, and amber glowing buttons.",
      category: "Chat",
      stars: false
    }
  ]);

  const moods = ["Cinematic", "Cyberpunk", "Minimalist Luxury", "Symmetric", "Surrealism", "Vaporwave"];
  const styles = [
    "3D Obsidian Glow",
    "Liquid Mercury",
    "Translucent Amber Glassmorphism",
    "Vector Line Art",
    "Photorealistic 8K",
    "Impressionist Painting"
  ];
  const lightings = [
    "Dramatic Chiaroscuro",
    "Neon Glow Rim",
    "Volumetric Sunbeams",
    "Ambient Soft Studio",
    "High-Contrast Silhouette",
    "Sunset Golden Hour"
  ];

  const handleApplyPreset = () => {
    const presetText = `A high-end ${selectedStyle.toLowerCase()} visual art, styled with a ${selectedMood.toLowerCase()} theme and ${selectedLighting.toLowerCase()} lighting. Highly polished, premium 8k render, perfect composition.`;
    setPromptInput(presetText);
    setPromptTitle(`${selectedStyle} Concept`);
    toast.success("Style formula compiled and loaded into prompt box!");
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const title = promptTitle.trim() || "Untitled Curation";
    const newPrompt: SavedPrompt = {
      id: `p-${Date.now()}`,
      title,
      text: promptInput,
      category: "Custom",
      stars: false
    };

    setSavedPrompts([newPrompt, ...savedPrompts]);
    setPromptInput("");
    setPromptTitle("");
    toast.success("Prompt successfully archived in your studio library!");
  };

  const toggleStar = (id: string) => {
    setSavedPrompts(savedPrompts.map(p => p.id === id ? { ...p, stars: !p.stars } : p));
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id));
    toast.success("Prompt curation removed.");
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };



  const filteredPrompts = selectedCategory === "All" 
    ? savedPrompts 
    : savedPrompts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8  p-1 text-left relative">


      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit block">
              Prompt Engineering Center
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
              Elite Prompt Studio
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Synthesize, format, and organize highly advanced prompts using customized visual and cognitive parameters tailored for premium model reasoning.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Parameter Panel */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#1F1F1F] pb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Formula Synthesizer</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mood */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-zinc-500" /> Aesthetic Mood
              </label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/40"
              >
                {moods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" /> Visual Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/40"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Lighting */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-zinc-500" /> Lighting Model
              </label>
              <select
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value)}
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/40"
              >
                {lightings.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleApplyPreset}
              className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
            >
              Compile Parameters
            </button>
          </div>

          <form onSubmit={handleSavePrompt} className="border-t border-[#1F1F1F] pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Curation Title</label>
              <input
                type="text"
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="Give your prompt a luxury title (e.g., Amber Mercury Sphere)..."
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Prompt Structure</label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Write your beautiful generative prompt here, or compile using parameters above..."
                className="w-full bg-[#18181B] border border-[#242424] rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 transition h-28 resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-[#F59E0B] bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Archive to My Prompts
              </button>
            </div>
          </form>
        </div>

        {/* Right Saved Prompts Library */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 flex flex-col h-[520px]">
          <div className="border-b border-[#1F1F1F] pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Saved Curation</h4>
              </div>
              <span className="text-[9px] text-[#71717A] uppercase font-mono">{savedPrompts.length} Archived</span>
            </div>

            {/* Simple Category Tabs */}
            <div className="flex gap-1.5 mt-4 overflow-x-auto scrollbar-none">
              {["All", "Image", "Chat", "Custom"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-transparent text-zinc-500 hover:text-zinc-300 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 mt-4 pr-1 custom-scrollbar">
            {filteredPrompts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-600">
                <BookOpen className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs">No saved curations in this tier</p>
              </div>
            ) : (
              filteredPrompts.map((p) => (
                <div key={p.id} className="p-3.5 bg-[#18181B]/40 hover:bg-[#18181B] border border-[#242424] hover:border-zinc-800 rounded-xl transition space-y-2 text-left relative group">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-850 text-[8px] font-bold uppercase text-zinc-400 font-mono tracking-wider">{p.category}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleStar(p.id)}
                        className={`p-1 rounded transition ${p.stars ? "text-amber-500" : "text-zinc-600 hover:text-zinc-400"}`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => deletePrompt(p.id)}
                        className="p-1 rounded text-zinc-600 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                        title="Purge prompt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white">{p.title}</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-1 line-clamp-3">{p.text}</p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => copyText(p.id, p.text)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 border border-[#242424] rounded-lg text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-amber-500 flex items-center gap-1 transition"
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
