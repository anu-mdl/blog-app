import React from 'react';
import { render } from '@testing-library/react';
import { CommentComponent } from '@/components/blog/post/CommentComponent';
import { CommentsRecordExtended } from '@/api/extended_types';

jest.mock('@/lib/utils', () => ({
  formatDate: jest.fn().mockImplementation((date: string) => {
    if (date === '2025-06-12T10:30:00Z') return 'June 12, 2025';
    if (date === '2025-06-10T08:15:00Z') return 'June 10, 2025';
    return 'Mock Date';
  }),
  cn: jest
    .fn()
    .mockImplementation((...classes: (string | undefined)[]) =>
      classes.filter(Boolean).join(' ')
    )
}));

jest.mock('lucide-react', () => ({
  Heart: () => <svg data-testid="heart-icon" aria-label="heart" />
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('CommentComponent', () => {
  const baseMockComment: CommentsRecordExtended = {
    id: 'comment-1',
    content: 'This is a test comment with some content to display.',
    created: '2025-06-12T10:30:00Z',
    likes: 5,
    author: {
      id: 'user-1',
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg',
      email: 'test@example.com',
      password: 'mockpassword',
      tokenKey: 'mocktoken'
    }
  };

  describe('Top-level comments', () => {
    it('renders a standard comment correctly', () => {
      const { container } = render(
        <CommentComponent comment={baseMockComment} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with high likes count', () => {
      const commentWithManyLikes = {
        ...baseMockComment,
        likes: 142
      };

      const { container } = render(
        <CommentComponent comment={commentWithManyLikes} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with zero likes', () => {
      const commentWithZeroLikes = {
        ...baseMockComment,
        likes: 0
      };

      const { container } = render(
        <CommentComponent comment={commentWithZeroLikes} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with long content', () => {
      const commentWithLongContent = {
        ...baseMockComment,
        content:
          'This is a very long comment that contains multiple sentences and should test how the component handles longer text content. It includes various punctuation marks, and tests the word wrapping functionality of the component. This helps ensure that the layout remains consistent even with extensive content.'
      };

      const { container } = render(
        <CommentComponent comment={commentWithLongContent} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with multiline content', () => {
      const commentWithMultilineContent = {
        ...baseMockComment,
        content:
          'First line of the comment.\n\nSecond paragraph after line break.\n\nThird paragraph with more content.'
      };

      const { container } = render(
        <CommentComponent comment={commentWithMultilineContent} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Reply comments', () => {
    it('renders reply comment with indentation', () => {
      const { container } = render(
        <CommentComponent comment={baseMockComment} isReply={true} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders reply comment with different author', () => {
      const replyComment = {
        ...baseMockComment,
        id: 'comment-reply-1',
        content: 'This is a reply to the original comment.',
        author: {
          ...baseMockComment.author,
          id: 'user-2',
          username: 'replyuser',
          avatar: 'https://example.com/reply-avatar.jpg'
        }
      };

      const { container } = render(
        <CommentComponent comment={replyComment} isReply={true} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Avatar handling', () => {
    it('renders comment without avatar (fallback)', () => {
      const commentWithoutAvatar = {
        ...baseMockComment,
        author: {
          ...baseMockComment.author,
          avatar: undefined
        }
      };

      const { container } = render(
        <CommentComponent comment={commentWithoutAvatar} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with empty avatar string', () => {
      const commentWithEmptyAvatar = {
        ...baseMockComment,
        author: {
          ...baseMockComment.author,
          avatar: ''
        }
      };

      const { container } = render(
        <CommentComponent comment={commentWithEmptyAvatar} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with single character username', () => {
      const commentWithSingleCharUsername = {
        ...baseMockComment,
        author: {
          ...baseMockComment.author,
          username: 'A',
          avatar: undefined
        }
      };

      const { container } = render(
        <CommentComponent comment={commentWithSingleCharUsername} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with long username', () => {
      const commentWithLongUsername = {
        ...baseMockComment,
        author: {
          ...baseMockComment.author,
          username: 'verylongusernamethatmighttruncate'
        }
      };

      const { container } = render(
        <CommentComponent comment={commentWithLongUsername} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Date handling', () => {
    it('renders comment with different date', () => {
      const commentWithDifferentDate = {
        ...baseMockComment,
        created: '2025-06-10T08:15:00Z'
      };

      const { container } = render(
        <CommentComponent comment={commentWithDifferentDate} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with empty date', () => {
      const commentWithEmptyDate = {
        ...baseMockComment,
        created: ''
      };

      const { container } = render(
        <CommentComponent comment={commentWithEmptyDate} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with undefined date', () => {
      const commentWithUndefinedDate = {
        ...baseMockComment,
        created: undefined
      };

      const { container } = render(
        <CommentComponent comment={commentWithUndefinedDate} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Edge cases', () => {
    it('renders comment with special characters in content', () => {
      const commentWithSpecialChars = {
        ...baseMockComment,
        content:
          'Comment with special chars: <>&"\'`~!@#$%^&*()_+-=[]{}|;:,.<>?'
      };

      const { container } = render(
        <CommentComponent comment={commentWithSpecialChars} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with emoji in content', () => {
      const commentWithEmoji = {
        ...baseMockComment,
        content:
          'Great post! 👍 Really enjoyed reading this 😊 Keep up the good work! 🚀'
      };

      const { container } = render(
        <CommentComponent comment={commentWithEmoji} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders comment with undefined username', () => {
      const commentWithUndefinedUsername = {
        ...baseMockComment,
        author: {
          ...baseMockComment.author,
          username: undefined
        }
      };

      const { container } = render(
        <CommentComponent comment={commentWithUndefinedUsername} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
