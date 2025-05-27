'use client';

import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Link, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Share:
      </span>

      <Button variant="outline" size="icon" asChild>
        <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Share on Twitter</span>
        </a>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
          <span className="sr-only">Share on Facebook</span>
        </a>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
          <span className="sr-only">Share on LinkedIn</span>
        </a>
      </Button>

      <Button variant="outline" size="icon" onClick={handleCopyLink}>
        {copied ? (
          <Copy className="h-4 w-4 text-green-600" />
        ) : (
          <Link className="h-4 w-4" />
        )}
        <span className="sr-only">{copied ? 'Link copied' : 'Copy link'}</span>
      </Button>
    </div>
  );
}
