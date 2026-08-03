import {
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Send,
  Share2,
  MessageCircle,
  LucideIcon
} from "lucide-react";

export interface SocialLinkItem {
  id: string;
  label: string;
  href: string;
  platform: string;
}

export const PLATFORM_ICONS: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  Twitter: Twitter,
  GitHub: Github,
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  Website: Globe,
  Telegram: Send,
  Discord: MessageCircle,
  Other: Share2,
};

const SOCIAL_LINKS_KEY = "gochat_social_links";

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: "s-1", label: "LinkedIn", href: "https://linkedin.com", platform: "LinkedIn" },
  { id: "s-2", label: "Twitter", href: "https://twitter.com", platform: "Twitter" },
  { id: "s-3", label: "GitHub", href: "https://github.com", platform: "GitHub" },
  { id: "s-4", label: "Facebook", href: "https://facebook.com", platform: "Facebook" },
  { id: "s-5", label: "Instagram", href: "https://instagram.com", platform: "Instagram" },
  { id: "s-6", label: "YouTube", href: "https://youtube.com", platform: "YouTube" },
];

export function getStoredSocialLinks(): SocialLinkItem[] {
  try {
    const raw = localStorage.getItem(SOCIAL_LINKS_KEY);
    if (!raw) return DEFAULT_SOCIAL_LINKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_SOCIAL_LINKS;
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export function saveSocialLinks(links: SocialLinkItem[]): void {
  try {
    localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent("gochat_social_links_updated", { detail: links }));
  } catch (e) {
    console.error("Failed to save social links to localStorage", e);
  }
}
