import type {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  CookieConsent,
  BrandingConfig,
  AIAsset,
} from "../../types";

// ─── Users ───────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: "u-1",
    name: "Dev Coder",
    email: "devcoderm13@gmail.com",
    role: "Developer",
    tier: "pro",
    credits: 1540,
    joined: "2026-07-01",
    status: "active",
  },
  {
    id: "u-2",
    name: "Ananya Sharma",
    email: "ananya.sharma@gochat.ai",
    role: "Administrator",
    tier: "enterprise",
    credits: 9200,
    joined: "2026-05-18",
    status: "active",
  },
  {
    id: "u-3",
    name: "Ravi Patel",
    email: "ravi.patel@gmail.com",
    role: "User",
    tier: "basic",
    credits: 320,
    joined: "2026-06-12",
    status: "active",
  },
  {
    id: "u-4",
    name: "Meera Kapoor",
    email: "meera.kapoor@outlook.com",
    role: "User",
    tier: "free",
    credits: 50,
    joined: "2026-07-10",
    status: "suspended",
  },
  {
    id: "u-5",
    name: "Arjun Singh",
    email: "arjun.singh@gochat.ai",
    role: "Developer",
    tier: "pro",
    credits: 4800,
    joined: "2026-04-25",
    status: "active",
  },
];

// ─── AI Models ───────────────────────────────────────────
export const mockModels: SystemModel[] = [
  {
    id: "m-1",
    name: "Gemini 2.5 Flash",
    type: "Text",
    version: "gemini-2.5-flash",
    status: "active",
    description:
      "Ultra-fast multi-purpose text generation engine. Ideal for conversational chat and rapid completions.",
    latency: "0.3s",
  },
  {
    id: "m-2",
    name: "Gemini 2.5 Pro",
    type: "Text",
    version: "gemini-2.5-pro",
    status: "active",
    description:
      "Advanced reasoning and complex task model with extended context window support.",
    latency: "0.8s",
  },
  {
    id: "m-3",
    name: "Imagen 4 Ultra",
    type: "Image",
    version: "imagen-4-ultra",
    status: "active",
    description:
      "Photorealistic image generation pipeline with fine-grained style controls.",
    latency: "2.1s",
  },
  {
    id: "m-4",
    name: "Veo 3",
    type: "Video",
    version: "veo-3",
    status: "inactive",
    description:
      "Next-gen video synthesis model. Currently in beta evaluation phase.",
    latency: "4.5s",
  },
  {
    id: "m-5",
    name: "Gemini 2.5 Flash Lite",
    type: "Image",
    version: "gemini-2.5-flash-lite-image",
    status: "active",
    description:
      "Lightweight image generation tuned for speed and lower credit cost.",
    latency: "1.2s",
  },
];

// ─── Subscriptions ───────────────────────────────────────
export const mockSubscriptions: SubscriptionRecord[] = [
  {
    id: "s-1",
    userEmail: "devcoderm13@gmail.com",
    plan: "Pro",
    price: "₹1,499",
    cycle: "Monthly",
    date: "2026-07-01",
    status: "paid",
  },
  {
    id: "s-2",
    userEmail: "ananya.sharma@gochat.ai",
    plan: "Enterprise",
    price: "₹4,999",
    cycle: "Monthly",
    date: "2026-06-15",
    status: "paid",
  },
  {
    id: "s-3",
    userEmail: "ravi.patel@gmail.com",
    plan: "Basic",
    price: "₹499",
    cycle: "Monthly",
    date: "2026-06-20",
    status: "paid",
  },
  {
    id: "s-4",
    userEmail: "meera.kapoor@outlook.com",
    plan: "Free",
    price: "₹0",
    cycle: "—",
    date: "2026-07-10",
    status: "free",
  },
  {
    id: "s-5",
    userEmail: "arjun.singh@gochat.ai",
    plan: "Pro",
    price: "₹1,499",
    cycle: "Monthly",
    date: "2026-05-01",
    status: "paid",
  },
];

// ─── Audit Logs ──────────────────────────────────────────
export const mockLogs: AuditLog[] = [
  {
    id: "log-1",
    action: "User Created",
    operator: "ananya.sharma@gochat.ai",
    timestamp: "2026-07-19 14:32:00",
    details: "Deployed account for ravi.patel@gmail.com with 320 credits.",
  },
  {
    id: "log-2",
    action: "Model Toggled",
    operator: "devcoderm13@gmail.com",
    timestamp: "2026-07-19 13:10:00",
    details: "Disabled model Veo 3 (veo-3) for maintenance.",
  },
  {
    id: "log-3",
    action: "Branding Updated",
    operator: "ananya.sharma@gochat.ai",
    timestamp: "2026-07-18 22:05:00",
    details: 'Updated platform logo name to "GoChat AI".',
  },
  {
    id: "log-4",
    action: "User Purged",
    operator: "devcoderm13@gmail.com",
    timestamp: "2026-07-18 18:44:00",
    details: "Permanently deleted user test-user@temp.com.",
  },
  {
    id: "log-5",
    action: "Credits Adjusted",
    operator: "ananya.sharma@gochat.ai",
    timestamp: "2026-07-17 09:20:00",
    details:
      "Increased credits for arjun.singh@gochat.ai from 3200 to 4800.",
  },
];

// ─── Cookie Consents ─────────────────────────────────────
export const mockCookieConsents: CookieConsent[] = [
  {
    id: "cc-1",
    user: "devcoderm13@gmail.com",
    consented: true,
    categories: ["essential", "analytics", "marketing"],
    timestamp: "2026-07-19 12:00:00",
  },
  {
    id: "cc-2",
    user: "ravi.patel@gmail.com",
    consented: true,
    categories: ["essential", "analytics"],
    timestamp: "2026-07-18 09:15:00",
  },
];

// ─── Branding ────────────────────────────────────────────
export const mockBranding: BrandingConfig = {
  appName: "GoChat AI",
  logoName: "GoChat AI",
  logoImage: "",
  mainLogo: "",
  favicon: "",
  mobileLogo: "",
  themeMode: "Black Amber",
  primaryColor: "#F59E0B",
  accentGlow: "rgba(245, 158, 11, 0.15)",
  footerText: "© 2026 GoChat AI — The luxury standard for multi-modal intelligence.",
};

// ─── Assets ──────────────────────────────────────────────
export const mockAssets: AIAsset[] = [
  {
    id: "a-1",
    type: "image",
    title: "Obsidian Gemstone",
    prompt: "Luxurious dark abstract crystalline obsidian stone with glowing amber gold core",
    content: "https://placehold.co/512x512/111111/F59E0B?text=Obsidian+Gem",
    model: "imagen-4-ultra",
    timestamp: "2026-07-19 11:30:00",
  },
  {
    id: "a-2",
    type: "image",
    title: "Amber Horizon",
    prompt: "Cinematic wide-angle desert sunset with warm amber tones and silhouette mountains",
    content: "https://placehold.co/1024x576/1A1A1A/F59E0B?text=Amber+Horizon",
    model: "gemini-2.5-flash-lite-image",
    timestamp: "2026-07-18 16:15:00",
  },
  {
    id: "a-3",
    type: "chat",
    title: "System Architecture Report",
    prompt: "Generate a detailed microservices architecture overview",
    content: "## Architecture Overview\n\nThe GoChat AI platform leverages a microservices pattern...",
    model: "gemini-2.5-pro",
    timestamp: "2026-07-17 09:00:00",
  },
  {
    id: "a-4",
    type: "plan",
    title: "Q3 Market Expansion Plan",
    prompt: "Create a business plan for expanding into Southeast Asian markets",
    content: "# Q3 2026 Market Expansion Strategy\n\n## Executive Summary...",
    model: "gemini-2.5-pro",
    timestamp: "2026-07-16 14:22:00",
  },
  {
    id: "a-5",
    type: "image",
    title: "Neural Interface",
    prompt: "Futuristic neural network visualization with dark background and gold synapses",
    content: "https://placehold.co/512x512/090909/F59E0B?text=Neural+Net",
    model: "imagen-4-ultra",
    timestamp: "2026-07-15 20:10:00",
  },
];
