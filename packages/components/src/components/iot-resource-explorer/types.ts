import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { TableProps } from '@awsui/components-react';

export interface FilterTexts {
  placeholder: string;
  empty: string;
  noMatch: string;
}

export interface ColumnDefinition<T> extends TableProps.ColumnDefinition<T> {
  header: string;
  cell: (item: T) => string | undefined;
}

export interface SitewiseAssetResource extends AssetSummary {
  hasChildren: boolean;
  parentId?: string;
}

export interface ResourceExplorerBaseQuery {
  source: string;
}

export type ResourceExplorerQuery = ResourceExplorerBaseQuery & any;
