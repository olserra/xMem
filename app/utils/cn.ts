import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and optimizes Tailwind classes with twMerge
 *
 * @param inputs - Class values to be combined
 * @returns Merged and optimized class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}