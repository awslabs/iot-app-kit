import { type BatchGetAssetPropertyValueCommandInput } from '@aws-sdk/client-iotsitewise';

type Entries = NonNullable<BatchGetAssetPropertyValueCommandInput['entries']>;

export class LatestValueCacheKeyFactory {
  public create(entries: Entries) {
    const cacheKey = [{ resource: 'latest value', entries }] as const;

    return cacheKey;
  }
}
