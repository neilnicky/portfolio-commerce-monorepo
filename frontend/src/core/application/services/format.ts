import { Money } from "@domain/value-objects/money.vo";

/** Pure cross-use-case formatting helpers (no I/O). Unit-tested in isolation. */

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: money.currency,
  }).format(money.major);
}

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
