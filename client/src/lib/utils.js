import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}


export function getDateRange(range) {
  const now = new Date();
  const start = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    case "week":
      start.setDate(now.getDate() - 7);
      return { start, end: now };
    case "month":
      start.setMonth(now.getMonth() - 1);
      return { start, end: now };
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      return { start, end: now };
    default:
      return { start: null, end: null };
  }
}
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
