import React from 'react';
import { cn } from '@/lib/utils';

export function PokeBall({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-12 h-12 fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M5 50 a45 45 0 0 1 90 0 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="15" fill="white" stroke="currentColor" strokeWidth="6" />
      <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="5" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="6" />
      <line x1="65" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}
