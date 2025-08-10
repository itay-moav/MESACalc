import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 * @param {...any} inputs - Class names, objects, or arrays to merge
 * @returns {string} Merged class names string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
