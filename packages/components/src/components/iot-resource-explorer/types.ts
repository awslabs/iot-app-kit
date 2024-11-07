import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { type TableProps } from '@awsui/components-react';

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
