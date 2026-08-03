import React, { useState, useMemo, useCallback } from "react";
import {
  FolderHeart, Search, Download, Trash2, Eye, X,
  Image as ImageIcon, MessageSquare, FileText, AlertCircle,
  Tv, Grid3X3, List, SortAsc, SortDesc, Calendar, Clock,
  Sparkles, Play, ChevronLeft, ChevronRight, Copy, Check,
  Filter, LayoutGrid, Layers
} from "lucide-react";
import { AIAsset } from "../types";
import { useGetAssetsQuery, useDeleteAssetMutation } from "../redux/api/apiSlice";

type FilterTab = "All" | "image" | "video" | "chat" | "plan";
type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "name";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string; glow: string }> = {
  image: { icon: ImageIcon, label: "Image", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", glow: "shadow-sky-500/20" },
  video: { icon: Tv, label: "Video", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-violet-500/20" },
  chat:  { icon: MessageSquare, label: "Chat", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
  plan:  { icon: FileText, label: "Plan", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
};

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function AssetsLibraryPage() {
  const { data: assets = [], isLoading } = useGetAssetsQuery();
  const [deleteAsset] = useDeleteAssetMutation();

  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [lightboxAsset, setLightboxAsset] = useState<AIAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: assets.length,
    images: assets.filter(a => a.type === "image").length,
    videos: assets.filter(a => a.type === "video").length,
    chats: assets.filter(a => a.type === "chat").length,
    plans: assets.filter(a => a.type === "plan").length,
  }), [assets]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let result = assets.filter(a => {
      const matchTab = activeTab === "All" || a.type === activeTab;
      const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
    result = [...result].sort((a, b) => {
      if (sortMode === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortMode === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [assets, activeTab, searchQuery, sortMode]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAsset({ id }).unwrap();
      if (lightboxAsset?.id === id) setLightboxAsset(null);
    } catch (e) { console.error(e); }
  }, [deleteAsset, lightboxAsset]);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Lightbox navigation
  const lightboxIndex = lightboxAsset ? filtered.findIndex(a => a.id === lightboxAsset.id) : -1;
  const goLightbox = (dir: 1 | -1) => {
    const next = lightboxIndex + dir;
    if (next >= 0 && next < filtered.length) setLightboxAsset(filtered[next]);
  };

  const tabs: { id: FilterTab; label: string; count: number; icon: React.ElementType }[] = [
    { id: "All", label: "All Assets", count: stats.total, icon: Layers },
    { id: "image", label: "Images", count: stats.images, icon: ImageIcon },
    { id: "video", label: "Videos", count: stats.videos, icon: Tv },
    { id: "chat", label: "Chats", count: stats.chats, icon: MessageSquare },
    { id: "plan", label: "Plans", count: stats.plans, icon: FileText },
  ];

  const cfg = (type: string) => TYPE_CONFIG[type] || TYPE_CONFIG.chat;

  return (
    <div className="space-y-6 p-1 text-left">

      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/[0.02] rounded-full blur-[60px] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest inline-flex items-center gap-1.5">
              <FolderHeart className="w-3 h-3" /> Creative Vault
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Gallery & Asset Library</h1>
            <p className="text-xs text-zinc-400 max-w-lg">Browse, filter, and manage every image, video, chat transcript, and business plan you've generated with AI.</p>
          </div>
          {/* Mini stat pills */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Images", count: stats.images, color: "sky" },
              { label: "Videos", count: stats.videos, color: "violet" },
              { label: "Chats", count: stats.chats, color: "emerald" },
            ].map(s => (
              <div key={s.label} className={`px-3 py-1.5 rounded-lg bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center gap-2`}>
                <span className={`text-sm font-extrabold text-${s.color}-400 font-numbers`}>{s.count}</span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Toolbar: Search / Tabs / View / Sort ─── */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl p-3 md:p-4 flex flex-col gap-4">
        {/* Top row: Search + Controls */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="gallery-search"
              type="text"
              placeholder="Search by title, prompt, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* View toggle */}
            <div className="flex bg-[#1A1A1A] border border-[#242424] rounded-lg overflow-hidden">
              {([["grid", Grid3X3], ["list", List]] as [ViewMode, React.ElementType][]).map(([mode, Icon]) => (
                <button
                  key={mode}
                  id={`view-mode-${mode}`}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 transition ${viewMode === mode ? "bg-amber-500/15 text-amber-500" : "text-zinc-500 hover:text-white"}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            {/* Sort select */}
            <select
              id="gallery-sort"
              value={sortMode}
              onChange={e => setSortMode(e.target.value as SortMode)}
              className="bg-[#1A1A1A] border border-[#242424] text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/40 transition"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`gallery-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition shrink-0 ${
                  isActive
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/15"
                    : "bg-[#1A1A1A] border border-[#242424] text-zinc-400 hover:text-white hover:border-zinc-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold ${isActive ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Results info ─── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-zinc-500 font-medium">
          Showing <span className="text-white font-bold">{filtered.length}</span> of {stats.total} assets
          {searchQuery && <span> matching "<span className="text-amber-500">{searchQuery}</span>"</span>}
        </p>
      </div>

      {/* ─── Content Area ─── */}
      {isLoading ? (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-24 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium animate-pulse">Loading your creative vault...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-16 text-center space-y-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-[#242424] flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-sm font-bold text-zinc-300">No assets found</p>
          <p className="text-xs text-zinc-500 max-w-sm">
            {searchQuery ? "Try adjusting your search or filter criteria." : "Generate images, videos, or chats to see them here."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid View ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(asset => {
            const c = cfg(asset.type);
            const TypeIcon = c.icon;
            const isMedia = asset.type === "image" || asset.type === "video";
            return (
              <div
                key={asset.id}
                onClick={() => setLightboxAsset(asset)}
                className="bg-[#111111] border border-[#242424] hover:border-zinc-600 rounded-2xl overflow-hidden group transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/20 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
                  {asset.type === "image" ? (
                    <img src={asset.content} alt={asset.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                  ) : asset.type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
                      <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
                        <Play className="w-6 h-6 text-violet-400 ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full p-4 flex flex-col justify-end relative">
                      <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <TypeIcon className={`w-5 h-5 ${c.color}`} />
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-4 leading-relaxed italic mt-8">"{asset.prompt}"</p>
                    </div>
                  )}

                  {/* Type badge */}
                  <div className={`absolute top-2.5 left-2.5 ${c.bg} backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-bold ${c.color} uppercase tracking-widest flex items-center gap-1 border ${c.border}`}>
                    <TypeIcon className="w-3 h-3" /> {c.label}
                  </div>

                  {/* Hover overlay */}
                  {isMedia && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                  <h5 className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-500 transition">{asset.title}</h5>
                  <div className="flex items-center justify-between text-[9px] text-zinc-600 font-mono">
                    <span className="truncate max-w-[60%]">{asset.model}</span>
                    <span className="shrink-0">{timeAgo(asset.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── List View ── */
        <div className="space-y-2">
          {filtered.map(asset => {
            const c = cfg(asset.type);
            const TypeIcon = c.icon;
            return (
              <div
                key={asset.id}
                onClick={() => setLightboxAsset(asset)}
                className="bg-[#111111] border border-[#242424] hover:border-zinc-600 rounded-xl p-3 flex items-center gap-4 cursor-pointer group transition-all duration-200"
              >
                {/* Mini thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0A0A0A] shrink-0 border border-[#242424]">
                  {asset.type === "image" ? (
                    <img src={asset.content} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${c.bg}`}>
                      <TypeIcon className={`w-5 h-5 ${c.color}`} />
                    </div>
                  )}
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-500 transition">{asset.title}</h5>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{asset.prompt}</p>
                </div>
                {/* Meta */}
                <div className="hidden md:flex items-center gap-4 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${c.bg} ${c.color} border ${c.border}`}>{c.label}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{asset.model}</span>
                  <span className="text-[10px] text-zinc-600">{timeAgo(asset.timestamp)}</span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(asset.id); }}
                    className="p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-600 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Lightbox / Detail Modal ─── */}
      {lightboxAsset && (() => {
        const a = lightboxAsset;
        const c = cfg(a.type);
        const TypeIcon = c.icon;
        return (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8" onClick={() => setLightboxAsset(null)}>
            <div className="relative bg-[#111111] border border-[#242424] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>

              {/* Left: Media / Preview */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-0">
                {a.type === "image" ? (
                  <img src={a.content} alt={a.title} className="max-w-full max-h-[70vh] object-contain" referrerPolicy="no-referrer" />
                ) : a.type === "video" ? (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <div className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-violet-400 ml-1" />
                    </div>
                    <p className="text-xs text-zinc-500">Video asset</p>
                  </div>
                ) : (
                  <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar w-full">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono">{a.content}</p>
                  </div>
                )}

                {/* Nav arrows */}
                {lightboxIndex > 0 && (
                  <button onClick={() => goLightbox(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-zinc-800 text-white transition">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {lightboxIndex < filtered.length - 1 && (
                  <button onClick={() => goLightbox(1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-zinc-800 text-white transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Right: Details panel */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#242424] p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {/* Close */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${c.bg} ${c.color} border ${c.border} flex items-center gap-1`}>
                    <TypeIcon className="w-3 h-3" /> {c.label}
                  </span>
                  <button id="lightbox-close" onClick={() => setLightboxAsset(null)} className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{a.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Model */}
                <div className="px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#242424]">
                  <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1">AI Model</p>
                  <p className="text-xs text-zinc-300 font-mono">{a.model}</p>
                </div>

                {/* Prompt */}
                <div className="px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#242424]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Source Prompt</p>
                    <button
                      onClick={() => handleCopy(a.prompt, `prompt-${a.id}`)}
                      className="text-zinc-600 hover:text-amber-500 transition"
                    >
                      {copiedId === `prompt-${a.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{a.prompt}"</p>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-3 border-t border-[#1F1F1F] grid grid-cols-2 gap-2">
                  {a.type === "image" ? (
                    <a
                      href={a.content}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/10"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  ) : (
                    <button
                      onClick={() => handleCopy(a.content, `content-${a.id}`)}
                      className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/10"
                    >
                      {copiedId === `content-${a.id}` ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-rose-950/20 border border-[#242424] hover:border-rose-500/30 text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
