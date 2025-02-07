export class AssetsForAssetModelCacheKeyFactory {
  #assetModelId: string | undefined;

  constructor(assetModelId?: string) {
    this.#assetModelId = assetModelId;
  }

  create() {
    return [
      { resource: 'assets for asset model', assetModelId: this.#assetModelId },
    ] as const;
  }
}
