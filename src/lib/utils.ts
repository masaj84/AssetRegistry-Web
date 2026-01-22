import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
