'use client';

import { useEffect } from 'react';

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      if (!heading.id) {
        const id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (id) {
          heading.id = id;
        }
      }
    });
  }, [content]);

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4 first:mt-0">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3">
            {line.slice(4)}
          </h3>
        );
      }

      if (line.trim() === '') {
        return <br key={index} />;
      }

      return (
        <p key={index} className="mb-4 leading-relaxed text-foreground/90">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
      {formatContent(content)}
    </div>
  );
}
