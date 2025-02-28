import { renderHook } from '@testing-library/react';
import { useComponentId } from './useComponentId';

// Mock uuid to return a predictable value
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mocked-uuid'),
}));

describe('useComponentId', () => {
  it('returns the provided ID when given', () => {
    const { result } = renderHook(() => useComponentId('custom-id'));
    expect(result.current).toBe('custom-id');
  });

  it('generates a new unique ID when no ID is provided', () => {
    const { result } = renderHook(() => useComponentId());
    expect(result.current).toBe('widget-mocked-uuid'); // Uses the mocked UUID
  });

  it('returns the same ID on re-render when the input ID does not change', () => {
    const { result, rerender } = renderHook(({ id }) => useComponentId(id), {
      initialProps: { id: 'fixed-id' },
    });

    expect(result.current).toBe('fixed-id');

    rerender({ id: 'fixed-id' });

    expect(result.current).toBe('fixed-id'); // Should not change
  });

  it('generates a new ID when the input ID changes', () => {
    const { result, rerender } = renderHook(({ id }) => useComponentId(id), {
      initialProps: { id: 'first-id' },
    });

    expect(result.current).toBe('first-id');

    rerender({ id: 'second-id' });

    expect(result.current).toBe('second-id'); // Should update to the new ID
  });
});
