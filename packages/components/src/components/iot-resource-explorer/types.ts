import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { TableProps } from '@awsui/components-react';
import { SiteWiseAssetTreeQuery } from '@iot-app-kit/core';

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

export type ResourceExplorerQuery = SiteWiseAssetTreeQuery; // | later | some more types
