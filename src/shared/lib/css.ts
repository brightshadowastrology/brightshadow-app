import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names or class values into a single string
 * using clsx and then merges Tailwind CSS classes properly with tailwind-merge
 * to handle conflicts correctly.
 *
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged className string with resolved Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
