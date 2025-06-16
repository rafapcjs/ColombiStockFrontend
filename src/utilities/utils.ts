// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina múltiples valores de clase usando clsx y luego optimiza las clases de Tailwind con twMerge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
