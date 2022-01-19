import { AssetSummary } from '@aws-sdk/client-iotsitewise';

export type CustomHTMLElement<T> = T & HTMLElement;

export type Modify<T, R> = Omit<T, keyof R> & R;

export type NetworkAssetSummary = Modify<
  AssetSummary,
  {
    creationDate: number;
    lastUpdateDate: number;
  }
>;
