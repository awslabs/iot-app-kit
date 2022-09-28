import { EntitySummary, GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
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

  it('should return empty when the entitySummariesByComponentType are not in the cache', () => {
    expect(cache.getEntitySummariesByComponentType('test-comp-1')).toBeUndefined();
  });

  it('should return cached entitySummariesByComponentType when available in the cache', () => {
    const mockEntitySummaries = [
      { entityId: 'test-1' },
      { entityId: 'test-2' },
      { entityId: 'test-3' },
    ] as EntitySummary[];
    cache.storeEntitySummariesByComponentType('test-comp-1', mockEntitySummaries);
    expect(cache.getEntitySummariesByComponentType('test-comp-1')).toEqual(mockEntitySummaries);
  });
});
