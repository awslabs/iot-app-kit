export class AssetModelsCacheKeyFactory {
  create() {
    return [{ resource: 'asset models' }] as const;
  }
}
