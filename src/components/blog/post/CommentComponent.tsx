import { CommentsRecordExtended } from '@/api/extended_types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { Heart } from 'lucide-react';

export const CommentComponent = ({
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
          src={comment.author.avatar || '/image.svg'}
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
