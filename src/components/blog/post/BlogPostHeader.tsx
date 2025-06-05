'use client';
import { LikesRecord } from '@/api/api_types';
import { PostsRecordExtended } from '@/api/extended_types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pb';
import { cn, formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Heart, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';

export function BlogPostHeader({ post }: { post: PostsRecordExtended }) {
  const user = pb.authStore.model;

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeRecordId, setLikeRecordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const countResult = await pb.collection('likes').getList(1, 1, {
          filter: `post = "${post.id}"`,
          perPage: 0
        });
        setLikesCount(countResult.totalItems);
        if (user?.id) {
          const userLike = await pb
            .collection('likes')
            .getFirstListItem(`post = "${post.id}" && user = "${user.id}"`);
          setIsLiked(true);
          setLikeRecordId(userLike.id);
        }
      } catch (err) {
        setIsLiked(false);
      }
    };

    fetchLikeData();
  }, [post.id, user?.id]);

  const handleLike = async () => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked && likeRecordId) {
        await pb.collection('likes').delete(likeRecordId);
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
        setLikeRecordId(null);
      } else {
        const newLike = await pb.collection('likes').create<LikesRecord>({
          post: post.id,
          user: user.id
        });
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
        setLikeRecordId(newLike.id);
      }
    } catch (err) {
      console.error('Like operation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: commentCount = 0 } = useQuery({
    queryKey: ['comments-count', post.id],
    queryFn: async () => {
      const { totalItems } = await pb.collection('comments').getList(1, 1, {
        filter: `post="${post.id}"`,
        fields: 'id',
        requestKey: null
      });
      return totalItems;
    }
  });

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
            <div className="font-medium mutationtext-foreground">
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
            <span>{commentCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={post.image ? pb.files.getURL(post, post.image) : '/image.svg'}
          alt="Cover"
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex items-center gap-2">
          {post.tags?.split(',').map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag.toLowerCase().replace(/\s+/g, '')}
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading || !user}
          className={cn(
            'h-8 px-2 gap-1 text-xs transition-colors',
            isLiked
              ? 'text-red-600 hover:text-red-700'
              : 'text-muted-foreground hover:text-red-600'
          )}
        >
          <Heart className={cn('h-3 w-3', isLiked && 'fill-current')} />
          <span>{likesCount}</span>
        </Button>
      </div>
    </header>
  );
}
