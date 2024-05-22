import type { AssetResource } from '../../../types/resources';

export type ParentAsset = Readonly<Pick<AssetResource, 'assetId' | 'name'>>;

export interface ResourcePathItem {
  id: string;
  name: string;
}
