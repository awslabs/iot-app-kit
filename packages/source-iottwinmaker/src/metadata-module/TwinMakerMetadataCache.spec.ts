import { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import { TwinMakerMetadataCache } from './TwinMakerMetadataCache';

describe('TwinMakerMetadataCache', () => {
  let cache: TwinMakerMetadataCache = new TwinMakerMetadataCache();

  beforeEach(() => {
    cache = new TwinMakerMetadataCache();
  });

  it('should return empty when the entity is not in the cache', () => {
    expect(cache.getEntity('test-1')).toBeUndefined();
  });

  it('should return cached entity when one is in the cache', () => {
    const mockEntity = { entityId: 'test-1' } as GetEntityResponse;
    cache.storeEntity(mockEntity);
    expect(cache.getEntity('test-1')).toBe(mockEntity);
  });
});
