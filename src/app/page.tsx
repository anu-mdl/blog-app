import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden justify-center items-center">
      <main className="flex-1 grid lg:grid-cols-2 items-center px-6 py-4 md:px-10 overflow-hidden w-[80%]">
        <div className="space-y-6 max-w-xl">
          <Badge
            variant="outline"
            className="px-3 py-1 border-primary/20 bg-primary/10 text-primary"
          >
            <span className="font-medium">New</span> — Modern blogging platform
            for developers
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Write, share, and grow your audience
          </h1>

          <p className="text-lg text-muted-foreground">
            SomeBlog is a powerful platform designed for developers and
            technical writers to share knowledge, build their personal brand,
            and connect with a global audience.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="gap-2">
              Sign up
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Rich editor</h3>
                <p className="text-sm text-muted-foreground">
                  Markdown and WYSIWYG support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">SEO optimized</h3>
                <p className="text-sm text-muted-foreground">
                  Rank higher in search results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track your audience growth
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">10,000+</span>{' '}
              developers already joined
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />

          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl opacity-50" />

            <div className="relative z-20 transform translate-x-8">
              <div className="bg-background border rounded-lg shadow-lg p-6 mb-6 max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">AJ</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Alex Johnson</h3>
                    <p className="text-xs text-muted-foreground">
                      Senior Developer • 5 min read
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">
                  The Future of Web Development in 2025
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  Explore the upcoming trends and technologies that will shape
                  the web development landscape...
                </p>
              </div>

              <div className="bg-background border rounded-lg shadow-lg p-6 max-w-sm ml-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">SM</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Sarah Miller</h3>
                    <p className="text-xs text-muted-foreground">
                      React Specialist • 8 min read
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">
                  Mastering React Server Components
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  Learn how to leverage React Server Components to build faster,
                  more efficient web applications...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-3 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 SomeBlog. All rights reserved.</p>
      </footer>
    </div>
  );
}
