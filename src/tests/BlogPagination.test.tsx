import { BlogPagination } from '@/components/blog/BlogPagination';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    onClick,
    disabled,
    ...props
  }: any) => (
    <button
      className={`btn ${variant} ${size} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>
}));

describe('BlogPagination', () => {
  const mockOnPageChange = jest.fn<void, [number]>();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination with few pages (≤5)', () => {
    const { container } = render(
      <BlogPagination
        currentPage={2}
        totalPages={4}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination when current page is at the beginning', () => {
    const { container } = render(
      <BlogPagination
        currentPage={2}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination when current page is at the end', () => {
    const { container } = render(
      <BlogPagination
        currentPage={9}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination when current page is in the middle', () => {
    const { container } = render(
      <BlogPagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination on first page', () => {
    const { container } = render(
      <BlogPagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination on last page', () => {
    const { container } = render(
      <BlogPagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination with only one page', () => {
    const { container } = render(
      <BlogPagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination with exactly 5 pages', () => {
    const { container } = render(
      <BlogPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination with many pages and current page near beginning', () => {
    const { container } = render(
      <BlogPagination
        currentPage={3}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders pagination with many pages and current page near end', () => {
    const { container } = render(
      <BlogPagination
        currentPage={18}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
