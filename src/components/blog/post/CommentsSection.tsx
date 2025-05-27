'use client';

import type React from 'react';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentsRecordExtended } from '@/api/extended_types';
import { pb } from '@/lib/pb';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const CommentSkeleton = () => (
  <div className="flex gap-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export function CommentsSection() {
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentCount = 5;
  const [newComment, setNewComment] = useState('');

  const { data, error, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await pb
        .collection('comments')
        .getFullList<CommentsRecordExtended>({
          filter: `post="${params.id}"`,
          sort: 'created',
          expand: 'author'
        });
      return response;
    }
  });

  const usePostComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        content,
        postId,
        authorId
      }: {
        content: string;
        postId: string;
        authorId: string;
      }) => {
        const response = await pb.collection('comments').create({
          content,
          post: postId,
          author: authorId,
          likes: 0,
          replies: []
        });
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
      onError: (error: Error) => {
        console.error('Failed to post comment:', error);
      }
    });
  };

  const postCommentMutation = usePostComment();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const authorId = pb.authStore.model?.id;
    if (!authorId) {
      console.error('User not authenticated');
      return;
    }

    try {
      await postCommentMutation.mutateAsync({
        content: newComment.trim(),
        postId: params.id,
        authorId
      });

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentComponent = ({
    comment,
    isReply = false
  }: {
    comment: CommentsRecordExtended;
    isReply?: boolean;
  }) => (
    <div className={`space-y-3 ${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={comment.author.avatar || '/placeholder.svg'}
            alt={comment.author.username}
          />
          <AvatarFallback>{comment.author.username?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium truncate">
              {comment.author.username}
            </span>
            <span className="text-muted-foreground whitespace-nowrap">
              {formatDate(comment.created || '')}
            </span>
          </div>

          <p className="text-sm leading-relaxed break-words hyphens-auto whitespace-pre-wrap word-break-break-word overflow-wrap-anywhere">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Heart className="h-3 w-3" />
              <span>{comment.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Comments ({commentCount})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 min-w-0">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>

        <div className="space-y-6 min-w-0">
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </>
          )}

          {error && (
            <div className="text-sm text-destructive">
              Failed to load comments. Please try again.
            </div>
          )}
          {data?.map(comment => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
