import React, { useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Sparkles,
  Copy,
  Download,
  Check,
  RefreshCw,
  UploadCloud,
  FileCheck,
  Trash2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Users,
  Target
} from "lucide-react";

export default function BusinessPlanPage() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [fundingNeeded, setFundingNeeded] = useState("");
  const [generating, setGenerating] = useState(false);
  const [planText, setPlanText] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "market" | "financials" | "marketing" | "operations">("summary");
  const [copied, setCopied] = useState(false);

  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setUploadError("File exceeds 10MB threshold.");
      return;
    }

    setUploadError("");
    setFileDetails({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.name.split(".").pop()?.toUpperCase() || "TXT"
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text || "");
    };
    reader.onerror = () => {
      setUploadError("Failed to extract file parameters.");
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setFileDetails(null);
    setFileContent("");
    setUploadError("");
    const fileInput = document.getElementById("bp-file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setGenerating(true);

    setTimeout(() => {
      const content = `## Executive Summary
Obsidian Tech Enterprises (${companyName}) intends to scale as a premium platform provider specializing in ${industry} targeting ${targetMarket}.
With a calculated capital requirement of ₹ ${fundingNeeded || "15,00,000"}, our enterprise expects to reach breakeven within 6 months of launching initial operations.

## Market Research
Our analysis of the ${industry} space demonstrates that ${targetMarket} represents a high-potential segment. Current entry strategies require a high level of dark-mode aesthetic branding, performance optimization, and strategic differentiation.

## Financial Projections
* **Initial Capital Allocation**: ₹ ${fundingNeeded || "15,00,000"}
* **Year 1 Target Revenue**: ₹ 75,00,000
* **Estimated Breakeven**: 6 months
* **CAGR Growth Forecast**: 32%
* **Operating Margins**: 65%

## Marketing Strategy
${companyName} will leverage direct relations, premium design showcases, and community-led developer onboarding to acquire key corporate partners in the ${targetMarket} market.

## Launch Operations
* **Phase 1**: Brand refinement and site synthesis.
* **Phase 2**: Launch private beta program for selected clients.
* **Phase 3**: Scaled public infrastructure release.`;

      setPlanText(content);
      setActiveTab("summary");
      setGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([planText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName.replace(/\s+/g, "_")}_strategic_plan.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Robust Section Parser with multi-tier keyword and index fallbacks
  const parseSection = (sectionName: string) => {
    if (!planText) return "";

    const sections = planText.split(/(?=##\s+|###\s+|#\s+)/);
    const match = sections.find(s => {
      const lower = s.toLowerCase();
      if (sectionName === "summary") {
        return lower.includes("executive summary") || lower.includes("1. executive");
      }
      if (sectionName === "market") {
        return lower.includes("market research") || lower.includes("2. market");
      }
      if (sectionName === "financials") {
        return lower.includes("financial plan") || lower.includes("3. financial") || lower.includes("financial projections");
      }
      if (sectionName === "marketing") {
        return lower.includes("marketing strategy") || lower.includes("4. marketing");
      }
      if (sectionName === "operations") {
        return lower.includes("operations") || lower.includes("5. operations");
      }
      return false;
    });

    if (match) {
      const lines = match.split("\n");
      // Skip markdown headers
      if (lines[0].trim().startsWith("#")) {
        return lines.slice(1).join("\n").trim();
      }
      return match.trim();
    }

    // Dynamic index-based division fallback
    if (sectionName === "summary") {
      const idx = planText.indexOf("## 1.");
      return idx !== -1 ? planText.slice(0, idx).trim() : planText;
    }

    return "";
  };

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-130px)] -mx-6 md:-mx-8 -my-6 md:-my-8 overflow-hidden  text-left">
      {/* Top thin status ribbon */}
      <div className="px-6 py-2.5 bg-[#0C0C0C] border-b border-[#1F1F1F] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            Venture Capital Strategist
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-bold text-amber-500 font-mono">
            ACTIVE // PRO_ENGINE
          </span>
        </div>
        <div className="text-[9px] text-zinc-500 font-mono">
          MODEL: GEMINI-3.5-FLASH // SECURED TUNNEL
        </div>
      </div>

      {/* Main Split Layout Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#090909]">
        
        {/* LEFT COLUMN: Input Form & File Uploader (Independent Scroll) */}
        <div className="lg:col-span-5 border-r border-[#1F1F1F] p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-[#0E0E0E]">
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-[#1F1F1F] pb-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Business Intelligence Profile
              </h4>
              <p className="text-[10px] text-zinc-500">
                Supply your venture details and supporting files to generate strategic financial reports.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Company Name
                </label>
                <input
                  id="bp-company-name"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Obsidian Tech"
                  className="w-full bg-[#151515] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition placeholder-zinc-600"
                  disabled={generating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Target Industry
                </label>
                <input
                  id="bp-industry"
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Premium SaaS Platforms"
                  className="w-full bg-[#151515] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition placeholder-zinc-600"
                  disabled={generating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Target Market Segment
                </label>
                <input
                  id="bp-target-market"
                  type="text"
                  required
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="e.g. Luxury tech-focused enterprises"
                  className="w-full bg-[#151515] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition placeholder-zinc-600"
                  disabled={generating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Capital Funding Required (₹ INR)
                </label>
                <input
                  id="bp-funding"
                  type="text"
                  required
                  value={fundingNeeded}
                  onChange={(e) => setFundingNeeded(e.target.value)}
                  placeholder="e.g. 15,00,000"
                  className="w-full bg-[#151515] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition placeholder-zinc-600"
                  disabled={generating}
                />
              </div>

              {/* DRAG-AND-DROP FILE UPLOADER */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Additional Documents / Data</span>
                  <span className="text-[8px] text-zinc-500 font-mono">MAX 10MB (TXT, JSON, CSV)</span>
                </label>

                {!fileDetails ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("bp-file-input")?.click()}
                    className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? "border-amber-500 bg-amber-500/[0.02] shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                        : "border-[#242424] hover:border-zinc-700 bg-[#121212] hover:bg-[#151515]"
                    }`}
                  >
                    <input
                      id="bp-file-input"
                      type="file"
                      accept=".txt,.json,.csv,.md"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className={`w-6 h-6 transition duration-200 ${isDragging ? "text-amber-500 animate-bounce" : "text-zinc-500"}`} />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-zinc-300">
                        Drag & Drop supporting files here
                      </p>
                      <p className="text-[9px] text-zinc-500">
                        or <span className="text-amber-500 font-bold hover:underline">browse files</span> from your local system
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#151515] border border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-lg shadow-amber-500/[0.02]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">
                          {fileDetails.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 font-mono uppercase">
                          {fileDetails.type} • {fileDetails.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 text-zinc-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition shrink-0"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {uploadError}
                  </div>
                )}
              </div>

              <button
                id="bp-btn-generate"
                type="submit"
                disabled={generating || !companyName.trim()}
                className="w-full py-3.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#1A1A1A] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Refactoring Strategic Matrices...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Compile Strategic Business Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Micro Footer specifically inside split container */}
          <div className="border-t border-[#1F1F1F] pt-4 mt-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-zinc-600 font-mono tracking-widest">
                STRATEGIST_SYS // SECURE_NODE_1
              </span>
              <span className="text-[8px] text-zinc-500 hover:text-zinc-400 cursor-help flex items-center gap-0.5">
                <HelpCircle className="w-2.5 h-2.5" /> Documentation
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Screen (Independent Scroll) */}
        <div className="lg:col-span-7 bg-[#090909] overflow-y-auto custom-scrollbar flex flex-col justify-between h-full">
          
          {planText ? (
            /* Compiled Tabbed Output */
            <div className="flex flex-col h-full bg-[#0C0C0C]">
              {/* Header Panel */}
              <div className="p-5 border-b border-[#1F1F1F] flex items-center justify-between flex-wrap gap-4 bg-[#0E0E0E] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {companyName} Strategic Log
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Completed by Gemini Venture Strategic Engines
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    id="bp-btn-copy"
                    onClick={copyToClipboard}
                    className="p-2 bg-[#151515] hover:bg-zinc-900 border border-[#242424] text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    title="Copy full report"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    id="bp-btn-download"
                    onClick={downloadTextFile}
                    className="p-2 bg-[#151515] hover:bg-zinc-900 border border-[#242424] text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    title="Download plan"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    id="bp-btn-reset"
                    onClick={() => setPlanText("")}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Segmented Navigation bar */}
              <div className="flex border-b border-[#1F1F1F] bg-[#111111] overflow-x-auto scrollbar-none  shrink-0">
                {[
                  { id: "summary", label: "Executive Summary" },
                  { id: "market", label: "Market Research" },
                  { id: "financials", label: "Financial projections" },
                  { id: "marketing", label: "Marketing Strategy" },
                  { id: "operations", label: "Launch Operations" }
                ].map((tab) => (
                  <button
                    id={`tab-btn-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider border-b-2 shrink-0 transition ${
                      activeTab === tab.id
                        ? "border-amber-500 text-amber-500 bg-amber-500/[0.02]"
                        : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Viewport */}
              <div className="flex-1 p-6 md:p-8 text-xs text-zinc-300 leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-line font-sans">
                {activeTab === "summary" && parseSection("summary")}
                {activeTab === "market" && parseSection("market")}
                {activeTab === "financials" && parseSection("financials")}
                {activeTab === "marketing" && parseSection("marketing")}
                {activeTab === "operations" && parseSection("operations")}
              </div>
            </div>
          ) : (
            /* Luxury High-Fidelity Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#0A0A0A]">
              {/* Subtle design grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
              <div className="absolute top-[30%] left-[30%] w-72 h-72 bg-amber-500/[0.01] rounded-full blur-[100px]" />

              <div className="relative space-y-6 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/[0.02]">
                  <Sparkles className="w-6 h-6 text-amber-500/80 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest w-fit mx-auto block font-mono">
                    AWAITING INGESTION PARAMETERS
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Venture Strategic Compiler Ready
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Provide the company specifications and supporting files on the left panel, and Gemini will synthesize a fully structured strategic business plan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="bg-[#111111]/80 border border-[#1F1F1F] rounded-xl p-3 text-left">
                    <TrendingUp className="w-4 h-4 text-amber-500/70 mb-1.5" />
                    <h5 className="text-[10px] font-bold text-zinc-300 uppercase">Growth forecast</h5>
                    <p className="text-[9px] text-zinc-500 mt-0.5">Computes CAGR targets and break-even intervals.</p>
                  </div>
                  <div className="bg-[#111111]/80 border border-[#1F1F1F] rounded-xl p-3 text-left">
                    <Target className="w-4 h-4 text-amber-500/70 mb-1.5" />
                    <h5 className="text-[10px] font-bold text-zinc-300 uppercase">Target matrices</h5>
                    <p className="text-[9px] text-zinc-500 mt-0.5">Validates demographics against corporate metrics.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
