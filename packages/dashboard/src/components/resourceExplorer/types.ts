import { BranchReference } from '@iot-app-kit/source-iotsitewise';
import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import type { TableProps } from '@awsui/components-react';
import type { TreeProvider } from '@iot-app-kit/core';
import type { SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';

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

export type MinimalCrumb = {
  name: string;
  id: string;
  text?: string;
};

export type ResourceExplorerCrumb = MinimalCrumb | SiteWiseAssetResource | AssetSummary;

export interface AssetNode {
  asset: AssetSummary;
}

export interface BranchReferenceWithAssetIds extends BranchReference {
  assetIds: string[];
}

export interface SiteWiseAssetTreeSessionInterface extends TreeProvider<SiteWiseAssetTreeNode[], BranchReference> {
  branches?: Record<string, BranchReferenceWithAssetIds>;
  assetNodes?: Record<string, AssetNode>;
}

export type MaybeSiteWiseAssetTreeSessionInterface = SiteWiseAssetTreeSessionInterface | undefined;
