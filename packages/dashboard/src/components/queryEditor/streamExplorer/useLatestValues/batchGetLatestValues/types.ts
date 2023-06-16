import type {
  AssetPropertyValue,
  BatchGetAssetPropertyValueCommandInput,
  BatchGetAssetPropertyValueCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type { ValueOf } from 'type-fest';

/** Entries sent with BatchGetAssetPropertyValue requests. */
export type BatchGetLatestValuesEntry = NonNullable<BatchGetAssetPropertyValueCommandInput['entries']>[number];

// entries returned from BatchGetAssetPropertyValue requests
export type BatchGetLatestValuesSuccessEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['successEntries']
>[number];
export type BatchGetLatestValuesSkippedEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['skippedEntries']
>[number];
export type BatchGetLatestValuesErrorEntry = NonNullable<
  BatchGetAssetPropertyValueCommandOutput['errorEntries']
>[number];

// we need a way to link asset property information
export interface AssetPropertyIdentifier {
  assetId?: Readonly<string>;
  propertyId?: Readonly<string>;
}
type Timestamp = NonNullable<AssetPropertyValue['timestamp']>;
type Value = ValueOf<NonNullable<AssetPropertyValue['value']>>;

export type ErrorValue = Pick<BatchGetLatestValuesErrorEntry, 'errorCode' | 'errorMessage'> & AssetPropertyIdentifier;
export type SkippedValue = Pick<BatchGetLatestValuesSkippedEntry, 'completionStatus' | 'errorInfo'> &
  AssetPropertyIdentifier;
export interface SuccessValue extends AssetPropertyIdentifier {
  timestamp?: Timestamp;
  value: Value;
}
