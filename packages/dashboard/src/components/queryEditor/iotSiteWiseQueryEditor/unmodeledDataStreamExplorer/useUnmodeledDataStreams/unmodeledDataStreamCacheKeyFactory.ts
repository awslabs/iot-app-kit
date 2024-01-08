export class UnmodeledDataStreamCacheKeyFactory {
  readonly #aliasPrefix: string | undefined;

  constructor(aliasPrefix?: string) {
    this.#aliasPrefix = aliasPrefix;
  }

  public create() {
    const cacheKey = [
      { resource: 'unmodeled data stream', aliasPrefix: this.#aliasPrefix },
    ] as const;

    return cacheKey;
  }
}
