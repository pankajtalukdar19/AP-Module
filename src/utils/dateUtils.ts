/**
 * Formats a date string or Date object into a readable format
 * @param date - Date string or Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return "N/A";

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns boolean
 */
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date - Date to get relative time for
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = new Date(date);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);

    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "Just now";
};
