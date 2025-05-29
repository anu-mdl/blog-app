'use client';

import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { pb } from '@/lib/pb';
import { useQuery } from '@tanstack/react-query';
import { PostsRecordExtended } from '@/api/extended_types';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All',
  'Technology',
  'React',
  'Next.js',
  'CSS',
  'Accessibility',
  'Security'
];

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  // const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await pb
        .collection('posts')
        .getFullList<PostsRecordExtended>({
          sort: 'created',
          expand: 'author'
        });
      return response;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data || data.length === 0) return <div>No data available</div>;

  const postsPerPage = 6;

  const filteredPosts = data?.filter(post => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`?${params.toString()}`);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts?.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    // setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query);
    router.push(`?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const featuredPost = data[0];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* HEADER */}
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Some Blog
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover the latest insights and news about web development, design,
          and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 mb-8">
        <div className="space-y-8">
          {/* SEARCH BAR */}
          <BlogSearch onSearch={handleSearch} />
          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Search results for:
              </span>
              <Badge variant="secondary" className="text-xs">
                {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  // onClick={() => setSearchQuery('')}
                  onClick={() => handleClearSearch()}
                >
                  <span className="sr-only">Clear search</span>×
                </Button>
              </Badge>
            </div>
          )}
          {!searchQuery && <BlogPostCard post={featuredPost} featured={true} />}
        </div>

        {/* CATEGORIES FILTER*/}
        <div className="space-y-6">
          <div className="bg-muted/40 p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer hover:bg-primary/20',
                    activeCategory === category && 'hover:bg-primary'
                  )}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* TODO: add tags filter??? */}

          <div className="bg-muted/40 p-6 rounded-lg">
            <h2 className="font-semibold mb-4">Newsletter</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter to get the latest updates directly in
              your inbox.
            </p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" />
              <Button className="w-full" disabled={true}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="latest" className="mb-8">
        <div className="flex items-center justify-between border-b">
          <TabsList className="h-auto p-0">
            <TabsTrigger
              value="latest"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 -mb-px data-[state=active]:text-foreground"
            >
              Latest
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 -mb-px data-[state=active]:text-foreground"
            >
              Trending
            </TabsTrigger>
            {/* <TabsTrigger
                value="popular"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 -mb-px data-[state=active]:text-foreground"
              >
                Popular
              </TabsTrigger> */}
          </TabsList>

          <div className="text-sm text-muted-foreground">
            {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {/* POSTS TABS*/}
        <TabsContent value="latest" className="pt-6">
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...currentPosts]
              .sort((a, b) => (b.likes || 0) - (a.likes || 0))
              .map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        {/* TODO: make sort by comments count */}
        {/* <TabsContent value="popular" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          </div>
        </TabsContent> */}
      </Tabs>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
