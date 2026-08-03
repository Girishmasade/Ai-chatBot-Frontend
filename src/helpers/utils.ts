import { SubscriptionRecord } from "../types";

/**
 * Formats a number with comma separators for displaying credits.
 */
export function formatCredits(credits: number): string {
  return typeof credits === "number" ? credits.toLocaleString() : "0";
}

/**
 * Formats a date string into a user-friendly local date string.
 */
export function formatDate(date: string | Date): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return String(date);
  }
}

/**
 * Calculates the total estimated monthly revenue from paid subscriptions.
 */
export function calculateRevenue(subscriptions: SubscriptionRecord[]): number {
  if (!Array.isArray(subscriptions)) return 0;
  return subscriptions
    .filter((s) => s.status === "paid")
    .reduce((acc, curr) => {
      const val = parseInt(curr.price.replace(/[^\d]/g, "")) || 0;
      return acc + val;
    }, 0);
}
