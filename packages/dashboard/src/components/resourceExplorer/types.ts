import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { TableProps } from '@awsui/components-react';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type NetworkAssetSummary = Modify<
  AssetSummary,
  {
    creationDate: number;
    lastUpdateDate: number;
  }
>;

export interface FilterTexts {
  placeholder: string;
  empty: string;
  noMatch: string;
}

export interface ColumnDefinition<T> extends TableProps.ColumnDefinition<T> {
  header: string;
  cell: (item: T) => string | undefined;
}

export interface SiteWiseAssetResource extends AssetSummary {
  hasChildren: boolean;
  parentId?: string;
}
