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
import Cookies from 'js-cookie';
import { pocketbase } from '@/api/pocketbase';
import { pocketbaseClient } from '@/api/pocketbase-client';
import { CommentComponent } from './CommentComponent';

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
  const [newComment, setNewComment] = useState('');
  let authorData = pb.authStore.model;

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
    const pb = await pocketbaseClient();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const authorId = pb.authStore.model?.id;
    if (!authorId) {
      try {
        const authData = await pb.collection('author').authRefresh();
        const refreshedAuthorauthorId = pb.authStore.model?.id;

        if (!refreshedAuthorauthorId) {
          return <div>Unable to retrieve author ID after refresh</div>;
        }

        authorData = await pb
          .collection('author')
          .getOne(refreshedAuthorauthorId);
      } catch (refreshError) {
        console.error('Error refreshing auth:', refreshError);
        return;
      }
    }

    if (authorId === undefined) {
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

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">
          Comments ({data?.length || 0})
        </CardTitle>
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
