import React from 'react';
import renderer from 'react-test-renderer';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { PostsRecordExtended } from '@/api/extended_types';
import { PostsRecord, UsersRecord } from '@/api/api_types';

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({
    className,
    children
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={`mock-avatar ${className || ''}`.trim()}>{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="mock-avatar-image" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-avatar-fallback">{children}</div>
  )
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    variant,
    className,
    children
  }: {
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <span
      className={`mock-badge variant-${variant || 'default'} ${
        className || ''
      }`.trim()}
    >
      {children}
    </span>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({
    className,
    children
  }: {
    className?: string;
    children: React.ReactNode;
  }) => <div className={`mock-card ${className || ''}`.trim()}>{children}</div>,
  CardHeader: ({
    className,
    children
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={`mock-card-header ${className || ''}`.trim()}>
      {children}
    </div>
  ),
  CardContent: ({
    className,
    children
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={`mock-card-content ${className || ''}`.trim()}>
      {children}
    </div>
  ),
  CardFooter: ({
    className,
    children
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={`mock-card-footer ${className || ''}`.trim()}>
      {children}
    </div>
  )
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} data-testid="mock-next-image" />;
  }
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => (
    <a href={href} {...props} data-testid="mock-next-link">
      {children}
    </a>
  )
}));

jest.mock('lucide-react', () => ({
  MessageSquare: (props: any) => (
    <svg {...props} data-testid="mock-messagesquare-icon" />
  )
}));

jest.mock('@/lib/pb', () => ({
  pb: {
    files: {
      getURL: jest.fn((record: any, filename: string | undefined) => {
        if (!filename) {
          return 'mock-pb-url/undefined-file.jpg';
        }
        return `mock-pb-url/${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      })
    }
  }
}));

jest.mock('@/lib/utils', () => ({
  formatDate: jest.fn((dateString: string | undefined) => {
    if (!dateString) return 'formatted-invalid-date';
    return `formatted-${new Date(dateString).toISOString().split('T')[0]}`;
  })
}));

describe('BlogPostCard Component', () => {
  const mockAuthor: UsersRecord = {
    id: 'author456',
    email: 'alex.writer@example.com',
    password: 'mockPassword123',
    tokenKey: 'mockTokenKeyABC',
    username: 'Alex Writer',
    avatar: 'author-avatar.png'
  };

  const baseMockPost: Omit<PostsRecord, 'id' | 'created' | 'author'> & {
    id: string;
    created: string;
    author: UsersRecord;
  } = {
    id: 'post123',
    created: '2023-01-15T10:30:00.000Z',
    title: 'Exploring Modern JavaScript Frameworks',
    content:
      'A deep dive into the ecosystems of React, Vue, and Svelte. This content is long enough to test line clamping.',
    category: 'JavaScript',
    image: 'sample-post-image.jpg',
    author: mockAuthor
  };

  const mockPost = baseMockPost as PostsRecordExtended;

  it('renders correctly when featured is true', () => {
    const tree = renderer
      .create(<BlogPostCard post={mockPost} featured={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when featured is false', () => {
    const tree = renderer
      .create(<BlogPostCard post={mockPost} featured={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when featured is not provided (defaults to false)', () => {
    const tree = renderer.create(<BlogPostCard post={mockPost} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with missing optional post image and author avatar', () => {
    const mockPostWithoutImages: PostsRecordExtended = {
      ...mockPost,
      image: undefined,
      author: {
        ...mockAuthor,
        avatar: undefined
      }
    };
    const tree = renderer
      .create(<BlogPostCard post={mockPostWithoutImages} featured={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly for a featured post with missing optional images', () => {
    const mockPostWithoutImages: PostsRecordExtended = {
      ...mockPost,
      image: undefined,
      author: {
        ...mockAuthor,
        avatar: undefined
      }
    };
    const tree = renderer
      .create(<BlogPostCard post={mockPostWithoutImages} featured={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
