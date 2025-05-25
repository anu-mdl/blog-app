import { BlogSearch } from '@/components/blog/BlogSearch';
import renderer from 'react-test-renderer';

jest.mock('@/components/ui/input', () => (props: any) => (
  <input {...props} data-testid="mock-input" />
));
jest.mock('@/components/ui/button', () => (props: any) => (
  <button {...props} data-testid="mock-button" />
));
jest.mock('lucide-react', () => ({
  Search: (props: any) => <svg {...props} data-testid="mock-search-icon" />
}));

describe('BlogSearch Component', () => {
  it('renders correctly and matches snapshot', () => {
    const mockOnSearch = jest.fn();
    const tree = renderer
      .create(<BlogSearch onSearch={mockOnSearch} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with an initial query (if you want to test different states)', () => {
    const mockOnSearch = jest.fn();
    const component = renderer.create(<BlogSearch onSearch={mockOnSearch} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
