import { PostsRecordExtended } from '@/api/extended_types';
import { BlogPostAuthor } from '@/components/blog/post/BlogPostAuthor';
import { BlogPostContent } from '@/components/blog/post/BlogPostContent';
import { BlogPostHeader } from '@/components/blog/post/BlogPostHeader';
import { CommentsSection } from '@/components/blog/post/CommentsSection';
import { ShareButtons } from '@/components/blog/post/ShareButtons';
import { TableOfContents } from '@/components/blog/post/TableOfContents';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { pb } from '@/lib/pb';

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await pb
    .collection('posts')
    .getFirstListItem<PostsRecordExtended>(`id="${id}"`, {
      expand: 'author'
    });

  if (!data || data.expand?.author === undefined) {
    return <div>Not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <article className="max-w-none min-w-0 overflow-hidden">
            <BlogPostHeader post={data} />

            <div className="flex items-center justify-between my-8 py-4 border-y">
              <ShareButtons
                url={`https://123.kz/blog/${data.id}`}
                title={data.title || ''}
              />
            </div>

            <div className="min-w-0 overflow-hidden">
              <BlogPostContent content={data.content || ''} />
            </div>

            <div className="mt-12 pt-8 border-t">
              <BlogPostAuthor author={data.expand?.author} />
            </div>

            <div className="mt-12 min-w-0">
              <CommentsSection />
            </div>
          </article>

          {data.tableOfContents && (
            <aside className="space-y-8">
              <TableOfContents items={data.tableOfContents || []} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
