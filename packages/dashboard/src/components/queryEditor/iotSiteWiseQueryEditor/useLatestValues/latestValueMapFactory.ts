import { type BatchGetAssetPropertyValueCommandOutput } from '@aws-sdk/client-iotsitewise';

import type { LatestValueMap } from './types';

export class LatestValueMapFactory {
  readonly #successEntries: NonNullable<
    BatchGetAssetPropertyValueCommandOutput['successEntries']
  >;
  readonly #skippedEntries: NonNullable<
    BatchGetAssetPropertyValueCommandOutput['skippedEntries']
  >;
  readonly #errorEntries: NonNullable<
    BatchGetAssetPropertyValueCommandOutput['errorEntries']
  >;

  constructor({
    successEntries = [],
    skippedEntries = [],
    errorEntries = [],
  }: Pick<
    BatchGetAssetPropertyValueCommandOutput,
    'successEntries' | 'skippedEntries' | 'errorEntries'
  >) {
    this.#successEntries = successEntries;
    this.#skippedEntries = skippedEntries;
    this.#errorEntries = errorEntries;
  }

  public create(): LatestValueMap {
    const latestValueMap: LatestValueMap = {
      ...this.#createLatestValueMapForSuccessEntries(),
      ...this.#createLatestValueMapForSkippedEntries(),
      ...this.#createLatestValueMapForErrorEntries(),
    };

    return latestValueMap;
  }

  #createLatestValueMapForSuccessEntries(): LatestValueMap {
    const latestValueMap = this.#successEntries.reduce<LatestValueMap>(
      (acc, entry) => ({
        ...acc,
        [entry.entryId ?? '']: {
          value: Object.values(entry.assetPropertyValue?.value ?? {})[0],
          timestamp: entry.assetPropertyValue?.timestamp?.timeInSeconds,
        },
      }),
      {}
    );

    return latestValueMap;
  }

  #createLatestValueMapForSkippedEntries(): LatestValueMap {
    const latestValueMap = this.#skippedEntries.reduce<LatestValueMap>(
      (acc, entry) => ({
        ...acc,
        [entry.entryId ?? '']: {
          value: undefined,
          timestamp: undefined,
        },
      }),
      {}
    );

    return latestValueMap;
  }

  #createLatestValueMapForErrorEntries(): LatestValueMap {
    const latestValueMap = this.#errorEntries.reduce<LatestValueMap>(
      (acc, entry) => ({
        ...acc,
        [entry.entryId ?? '']: {
          value: undefined,
          timestamp: undefined,
        },
      }),
      {}
    );

    return latestValueMap;
  }
}
