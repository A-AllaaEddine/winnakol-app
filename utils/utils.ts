import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatNumber = (number: number) => {
  if (number >= 1000 && number <= 999999) {
    return (number / 1000).toFixed(0) + 'K';
  } else if (number > 999999 && number <= 999999999) {
    return (number / 1000000).toFixed(0) + 'M';
  } else {
    return number?.toString();
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
