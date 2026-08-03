import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Download, Maximize2, Trash2, Calendar, HardDrive } from "lucide-react";
import { useGetAssetsQuery, useDeleteAssetMutation, useGenerateImageMutation, useGetModelsQuery } from "../redux/api/apiSlice";
import { toast } from "react-hot-toast";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [modelType, setModelType] = useState("gemini-3.1-flash-lite-image");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: allAssets = [] } = useGetAssetsQuery();
  const { data: models = [] } = useGetModelsQuery();
  const [deleteAsset] = useDeleteAssetMutation();
  const [generateImage, { isLoading: generating }] = useGenerateImageMutation();

  const imageModels = models.filter((m: any) => m.type === "image");
  const activeModelType = imageModels.some((m: any) => m.id === modelType) ? modelType : (imageModels[0]?.id || "");

  const assets = allAssets.filter((a: any) => a.type === "image");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("aspectRatio", aspectRatio);
      formData.append("modelType", activeModelType);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const data = await generateImage(formData).unwrap();
      if (data.success) {
        toast.success("Artwork generated successfully!");
        setPrompt("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to generate image. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset({ id }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  p-1">
      {/* Left Configuration Panel */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-6 text-left lg:col-span-1 h-fit">
        <div className="space-y-1 pb-3 border-b border-[#1F1F1F]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure Canvas</h4>
          <p className="text-[10px] text-zinc-500">Fine-tune generative AI parameters</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Creative Prompt</label>
            <textarea
              id="image-prompt-field"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Luxurious dark abstract crystalline obsidian stone with glowing amber gold core..."
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white placeholder-zinc-600 h-24 resize-none transition"
              disabled={generating}
            />
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Reference Image (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 file:transition file:cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              disabled={generating}
            />
            {imagePreview && (
              <div className="relative mt-2 w-full h-24 rounded-lg overflow-hidden border border-[#242424]">
                <img src={imagePreview} className="object-cover w-full h-full opacity-80" alt="Preview" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md hover:bg-rose-500 transition"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Aspect Ratio Toggle cards */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Square (1:1)", value: "1:1" },
                { label: "Wide (16:9)", value: "16:9" },
                { label: "Portrait (9:16)", value: "9:16" },
                { label: "Classic (4:3)", value: "4:3" }
              ].map((item) => (
                <button
                  id={`ratio-btn-${item.value}`}
                  key={item.value}
                  type="button"
                  onClick={() => setAspectRatio(item.value)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition ${
                    aspectRatio === item.value
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-[#1A1A1A] border-[#242424] text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Model Select */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Vision Engine</label>
            <select
              id="image-model-select"
              value={activeModelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-2.5 text-xs text-zinc-300 cursor-pointer transition"
            >
              {imageModels.length === 0 ? (
                <option value="">No models available</option>
              ) : (
                imageModels.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            id="image-btn-generate"
            type="submit"
            disabled={generating || !prompt.trim()}
            className="w-full py-3 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? "Refracting Crystal..." : "Generate Artwork"}
          </button>
        </form>
      </div>

      {/* Right Canvas Output & Gallery */}
      <div className="lg:col-span-3 space-y-6">
        {/* Render/Loading Space */}
        {generating && (
          <div className="bg-[#111111] border border-amber-500/20 rounded-2xl h-80 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
            {/* Shimmer pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.02] to-transparent -translate-x-full animate-shimmer" />
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-white uppercase tracking-wider animate-pulse">Running Vision Subprocessor</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed">Aligning light vectors, loading pixel matrices. Reassuring high-speed load.</p>
            </div>
          </div>
        )}

        {/* Gallery Grid of Assets */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Saved Studio Assets</h4>
              <p className="text-[10px] text-[#71717A]">High-fidelity PNG files stored on proxy cache</p>
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> Total: {assets.length} images
            </div>
          </div>

          {assets.length === 0 && !generating ? (
            <div className="bg-[#111111] border border-[#242424] rounded-2xl py-24 flex flex-col items-center justify-center text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-zinc-700" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400">Your visual gallery is clean</p>
                <p className="text-[10px] text-zinc-600 max-w-xs">Enter a creative description on the sidebar panel to generate custom high-end canvases.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#111111] border border-[#242424] hover:border-amber-500/20 rounded-2xl overflow-hidden group transition flex flex-col relative"
                >
                  {/* Image Viewport */}
                  <div className="relative aspect-square overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={asset.content}
                      alt={asset.title}
                      className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                      <button
                        id={`gallery-btn-view-${asset.id}`}
                        onClick={() => setLightboxUrl(asset.content)}
                        className="p-2.5 bg-black/80 hover:bg-black border border-zinc-800 rounded-xl text-white transition"
                        title="View Fullsize Lightbox"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <a
                        href={asset.content}
                        download={`${asset.title}.png`}
                        className="p-2.5 bg-black/80 hover:bg-black border border-zinc-800 rounded-xl text-white transition"
                        title="Download Asset"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Metadata Banner */}
                  <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-500 transition">
                        {asset.title}
                      </h5>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {asset.prompt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-[9px] font-mono text-zinc-600">
                      <span>{asset.model}</span>
                      <button
                        id={`gallery-btn-del-${asset.id}`}
                        onClick={() => handleDelete(asset.id)}
                        className="p-1 hover:text-rose-500 transition"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal overlay */}
      {lightboxUrl && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setLightboxUrl(null)}>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-zinc-800" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxUrl} alt="Artwork Large View" className="max-w-full max-h-[80vh] object-contain" referrerPolicy="no-referrer" />
            <button
              id="lightbox-close-btn"
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 hover:bg-black border border-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase transition"
            >
              Close View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
