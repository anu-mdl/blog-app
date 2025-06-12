import { CommentsRecordExtended } from '@/api/extended_types';
import { CommentComponent } from '@/components/blog/post/CommentComponent';
import { render } from '@testing-library/react';

jest.mock('@/lib/utils', () => ({
  formatDate: jest.fn().mockImplementation(() => 'June 12, 2025'),
  cn: jest
    .fn()
    .mockImplementation((...classes) => classes.filter(Boolean).join(' '))
}));

jest.mock('lucide-react', () => ({
  Heart: () => <svg data-testid="heart-icon" />
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('CommentComponent', () => {
  const mockComment: CommentsRecordExtended = {
    id: 'comment-1',
    content: 'This is a test comment content.',
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

  it('renders top-level comment correctly', () => {
    const { container } = render(<CommentComponent comment={mockComment} />);
    expect(container).toMatchSnapshot();
  });

  it('renders reply comment correctly', () => {
    const { container } = render(
      <CommentComponent comment={mockComment} isReply={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it('handles missing avatar with fallback', () => {
    const commentWithoutAvatar = {
      ...mockComment,
      author: {
        ...mockComment.author,
        avatar: undefined
      }
    };

    const { container } = render(
      <CommentComponent comment={commentWithoutAvatar} />
    );
    expect(container).toMatchSnapshot();
  });
});
