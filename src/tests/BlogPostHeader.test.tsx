import { BlogPostHeader } from '@/components/blog/post/BlogPostHeader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

jest.mock('@/lib/pb', () => ({
  pb: {
    authStore: {
      model: null
    },
    collection: jest.fn().mockReturnThis(),
    getList: jest.fn(),
    getFirstListItem: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    files: {
      getURL: jest
        .fn()
        .mockImplementation((_, filename) =>
          filename ? `https://mocked.pb.url/files/${filename}` : '/image.svg'
        )
    }
  }
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <span>CalendarIcon</span>,
  Heart: () => <span>HeartIcon</span>,
  MessageSquare: () => <span>MessageSquareIcon</span>
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: jest.fn(({ children }) => <div>{children}</div>),
  AvatarFallback: jest.fn(({ children }) => <div>{children}</div>),
  AvatarImage: jest.fn(({ src, alt }) => <img src={src} alt={alt} />)
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: jest.fn(({ children }) => <span>{children}</span>)
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  ))
}));

describe('BlogPostHeader', () => {
  const mockPost = {
    id: 'post123',
    category: 'Technology',
    title: 'Test Post Title',
    excerpt: 'This is a test post excerpt',
    created: '2023-01-01T12:00:00.000Z',
    tags: 'react,nextjs,testing',
    image: 'test-image.jpg',
    expand: {
      author: {
        id: 'user456',
        username: 'testuser',
        avatar: 'avatar.jpg'
      }
    }
  };

  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BlogPostHeader post={mockPost as any} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with authenticated user', async () => {
    require('@/lib/pb').pb.authStore.model = { id: 'user123' };

    require('@/lib/pb')
      .pb.collection('likes')
      .getList.mockResolvedValueOnce({ totalItems: 10 });
    require('@/lib/pb')
      .pb.collection('likes')
      .getFirstListItem.mockResolvedValueOnce({
        id: 'like123'
      });

    queryClient.setQueryData(['comments-count', mockPost.id], 5);

    const { asFragment } = renderComponent();

    expect(await screen.findByText('10')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly without authenticated user', async () => {
    require('@/lib/pb').pb.authStore.model = null;

    require('@/lib/pb')
      .pb.collection('likes')
      .getList.mockResolvedValueOnce({ totalItems: 7 });
    require('@/lib/pb')
      .pb.collection('likes')
      .getFirstListItem.mockRejectedValueOnce(new Error('Not found'));

    queryClient.setQueryData(['comments-count', mockPost.id], 3);

    const { asFragment } = renderComponent();

    expect(await screen.findByText('7')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with no author avatar', async () => {
    const postWithoutAvatar = {
      ...mockPost,
      expand: {
        author: {
          id: 'user456',
          username: 'testuser',
          avatar: null
        }
      }
    };

    require('@/lib/pb').pb.authStore.model = { id: 'user123' };

    require('@/lib/pb')
      .pb.collection('likes')
      .getList.mockResolvedValueOnce({ totalItems: 10 });
    require('@/lib/pb')
      .pb.collection('likes')
      .getFirstListItem.mockResolvedValueOnce({
        id: 'like123'
      });

    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <BlogPostHeader post={postWithoutAvatar as any} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('10')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with no image', async () => {
    const postWithoutImage = {
      ...mockPost,
      image: null
    };

    require('@/lib/pb').pb.authStore.model = { id: 'user123' };

    require('@/lib/pb')
      .pb.collection('likes')
      .getList.mockResolvedValueOnce({ totalItems: 10 });
    require('@/lib/pb')
      .pb.collection('likes')
      .getFirstListItem.mockResolvedValueOnce({
        id: 'like123'
      });

    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <BlogPostHeader post={postWithoutImage as any} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('10')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly while loading', () => {
    require('@/lib/pb').pb.authStore.model = { id: 'user123' };

    const { asFragment } = renderComponent();

    expect(asFragment()).toMatchSnapshot();
  });
});
