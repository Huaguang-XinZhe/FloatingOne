import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 组合多个类名，使用 clsx 处理条件类名，并用 tailwind-merge 优化
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 