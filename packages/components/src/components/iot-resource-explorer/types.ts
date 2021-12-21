import { AssetSummary } from '@aws-sdk/client-iotsitewise';

export interface FilterTexts {
  placeholder: string;
  empty: string;
  noMatch: string;
}

export interface SitewiseAssetResource extends AssetSummary {
  hasChildren: boolean;
  parentId?: string;
}
