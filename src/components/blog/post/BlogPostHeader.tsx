import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PostsRecordExtended } from '@/api/extended_types';
import { pb } from '@/lib/pb';
import Image from 'next/image';

export function BlogPostHeader({ post }: { post: PostsRecordExtended }) {
  const commentCount = 6;
  return (
    <header className="space-y-6">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          {post.category}
        </Badge>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
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
          <div>
            <div className="font-medium text-foreground">
              {post.expand?.author?.username}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.created || '')}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount} comments</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={post.image ? pb.files.getURL(post, post.image) : '/image.svg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {post.tags?.split(',').map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            #{tag.toLowerCase().replace(/\s+/g, '')}
          </Badge>
        ))}
      </div>
    </header>
  );
}
