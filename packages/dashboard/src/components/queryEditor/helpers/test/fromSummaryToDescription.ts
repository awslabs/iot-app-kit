import { createAssetDescriptionStub, type AssetDescription } from './createAssetDescriptionStub';
import { type createAssetSummaryStub } from './createAssetSummaryStub';

/** Transform an asset summary stub to a description. It happens! */
export function fromSummaryToDescription({
  id,
  assetModelId,
  arn,
  name,
  hierarchies,
  status,
  creationDate,
  lastUpdateDate,
  assetDescription = undefined,
  assetProperties = [],
  assetCompositeModels = [],
}: Partial<
  ReturnType<typeof createAssetSummaryStub> &
    Pick<AssetDescription, 'assetDescription' | 'assetProperties' | 'assetCompositeModels'>
> = {}) {
  return createAssetDescriptionStub({
    assetModelId,
    assetId: id,
    assetArn: arn,
    assetName: name,
    assetHierarchies: hierarchies,
    assetStatus: status,
    assetCreationDate: creationDate,
    assetLastUpdateDate: lastUpdateDate,
    assetDescription,
    assetProperties,
    assetCompositeModels,
  } as const satisfies AssetDescription);
}
