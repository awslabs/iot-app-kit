import {
  type BatchGetAssetPropertyValueCommandInput,
  type BatchGetAssetPropertyValueCommandOutput,
} from '@aws-sdk/client-iotsitewise';

export type Entry = NonNullable<
  BatchGetAssetPropertyValueCommandInput['entries']
>[number];
export type SuccessEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['successEntries']
>[number];
export type SkippedEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['skippedEntries']
>[number];
export type ErrorEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['errorEntries']
>[number];

type LatestValue = {
  value: string | number | boolean | undefined;
  timestamp: number | undefined;
};

export type LatestValueMap = Record<string, LatestValue>;
