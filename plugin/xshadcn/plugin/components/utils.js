/**
 * Utility functions for XShadcn components
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Helper function to merge Tailwind CSS class names
 * Uses clsx for conditional classes and twMerge to handle conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
