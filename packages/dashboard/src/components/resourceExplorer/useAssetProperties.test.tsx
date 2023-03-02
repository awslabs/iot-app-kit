import { renderHook, act } from '@testing-library/react';
import { useAssetProperties } from './useAssetProperties';

const testAssetId = 'warpcore01';
const testAssetProperties = [{ id: 'tps', name: 'Teradynes/Second' }];

describe('useAssetProperties', () => {
  it('returns the starting cache', () => {
    const { result } = renderHook(() => useAssetProperties());
    expect(result.current.cache).toEqual({});
  });

  it('hasKey returns false if a key is missing', () => {
    const { result } = renderHook(() => useAssetProperties());
    expect(result.current.hasKey(testAssetId)).toBe(false);
  });

  it('updates the cache with the right key/values and indicates cache hasKey', () => {
    const { result } = renderHook(() => useAssetProperties());
    act(() => {
      result.current.update(testAssetId, testAssetProperties);
    });
    expect(result.current.cache).toEqual({ [testAssetId]: testAssetProperties });
    expect(result.current.hasKey(testAssetId)).toBe(true);
  });
});
