"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PokeBall } from './PokeBall';
import { LayoutGrid, Brain, BookOpen } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: PokeBall },
    { href: '/study', label: 'Study', icon: BookOpen },
    { href: '/quiz/number', label: 'Number Quiz', icon: Brain },
    { href: '/quiz/name', label: 'Name Quiz', icon: LayoutGrid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t md:top-0 md:bottom-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-around p-2 md:p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-full transition-all hover:scale-105",
                isActive 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className={cn("w-6 h-6", label === 'Home' && "w-6 h-6")} />
              <span className="text-xs md:text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
