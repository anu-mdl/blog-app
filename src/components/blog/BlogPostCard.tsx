import { PostsRecordExtended } from '@/api/extended_types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { pb } from '@/lib/pb';
import { formatDate } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function BlogPostCard({
  post,
  featured = false
}: {
  post: PostsRecordExtended;
  featured?: boolean;
}) {
  const commentCount = 5;
  if (featured) {
    return (
      <Card className="overflow-hidden border-0 shadow-none md:grid md:grid-cols-2 md:gap-4 md:border md:shadow-sm">
        <div className="relative aspect-video overflow-hidden rounded-t-lg md:aspect-auto md:rounded-lg">
          <Image
            src={post.image ? pb.files.getURL(post, post.image) : '/image.svg'}
            width={1200}
            height={600}
            alt="blog post"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col justify-center p-6">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="px-2 py-0 text-xs">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(post.created || '')}
              </span>
            </div>
            <Link href={`/blog/${post.id}`} className="group">
              <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                {post.title}
              </h2>
            </Link>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="p-0 pt-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      post.expand?.author?.avatar
                        ? pb.files.getUrl(
                            post.expand.author,
                            post.expand.author.avatar
                          )
                        : '/image.svg'
                    }
                    alt={post.expand?.author?.username}
                  />
                  <AvatarFallback>
                    {post.expand?.author?.username?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {post.expand?.author?.username}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{commentCount}</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full transition-all hover:border-primary/50">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={post.image ? pb.files.getURL(post, post.image) : '/image.svg'}
          alt="blog post"
          width={354}
          height={199}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="px-2 py-0 text-xs">
            {post.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="text-sm text-muted-foreground mb-2">
          {formatDate(post.created || '')}
        </div>
        <Link href={`/blog/${post.id}`} className="group">
          <h3 className="font-bold tracking-tight transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  post.expand?.author?.avatar
                    ? pb.files.getUrl(
                        post.expand.author,
                        post.expand.author.avatar
                      )
                    : '/image.svg'
                }
                alt={post.expand?.author?.username}
              />
              <AvatarFallback>
                {post.expand?.author?.username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{post.expand?.author?.username}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
