/* -------------------------------------------------------------------------- */
/*                                NUMBER FORMAT                               */
/* -------------------------------------------------------------------------- */

export function formatNumber(value: number | null | undefined) {
  if (!value && value !== 0) return "0";
  return value.toLocaleString("en-US");
}

/**
 * Compact format: 1200 → 1.2K, 2500000 → 2.5M
 */
export function formatCompactNumber(value: number | null | undefined) {
  if (!value && value !== 0) return "0";

  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1)}M`;

  if (value >= 1_000)
    return `${(value / 1_000).toFixed(1)}K`;

  return value.toString();
}

/* -------------------------------------------------------------------------- */
/*                                  DATE FORMAT                               */
/* -------------------------------------------------------------------------- */

/**
 * Safe chart date formatting (avoids hydration mismatch)
 */
export function formatChartDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * "2 hours ago"
 * Pass `now` from server to avoid hydration mismatch
 */
export function formatTimeAgo(
  dateString: string | null,
  now: number
) {
  if (!dateString) return "Never";

  const diff = now - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);

  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}
