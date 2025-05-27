'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'block w-full text-left text-sm py-1 px-2 rounded transition-colors hover:bg-accent hover:text-accent-foreground',
                item.level === 3 && 'ml-4',
                item.level === 4 && 'ml-8',
                activeId === item.id &&
                  'bg-accent text-accent-foreground font-medium'
              )}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
