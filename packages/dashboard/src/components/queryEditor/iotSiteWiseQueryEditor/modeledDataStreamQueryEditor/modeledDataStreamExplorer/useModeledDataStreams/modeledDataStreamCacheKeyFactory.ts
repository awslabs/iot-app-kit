export class ModeledDataStreamCacheKeyFactory {
  public create(assetId: string) {
    const cacheKey = [{ resource: 'modeled data stream', assetId }] as const;

    return cacheKey;
  }
}
