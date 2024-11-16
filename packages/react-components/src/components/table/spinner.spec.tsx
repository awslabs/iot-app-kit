import { render } from '@testing-library/react';
import { LoadingSpinner } from './spinner';

describe('size', () => {
  it('does not specify height and width when no size provided', async () => {
    const { container } = render(<LoadingSpinner />);
    const svgElement = container.getElementsByTagName('svg').item(0)!;

    expect(svgElement.style.height).toBe('');
    expect(svgElement.style.width).toBe('');
  });

  it('does specify height and width when size provided', async () => {
    const SIZE = 34;
    const { container } = render(<LoadingSpinner size={SIZE} />);
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.style.height).toBe(`${SIZE}px`);
    expect(svgElement.style.width).toBe(`${SIZE}px`);
  });
});

describe('dark mode', () => {
  it('does not have the dark class present when dark is false', async () => {
    const { container } = render(<LoadingSpinner />);
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.classList).not.toContain('dark');
  });

  it('does display dark class when in dark mode', async () => {
    const { container } = render(<LoadingSpinner dark />);
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.classList).toContain('dark');
  });
});
