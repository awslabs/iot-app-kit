import { type DescribeAssetCommandOutput } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';

export type AssetDescription = Omit<DescribeAssetCommandOutput, '$metadata'>;

/** Create an IoT asset description stub to use for testing. Configure it for your test, or don't! */
export function createAssetDescriptionStub({
  assetModelId = uuid(),
  assetId = uuid(),
  assetArn = `arn:aws:iotsitewise:us-east-1:123456789012:asset/${assetId}`,
  assetName = `Test Asset Description (${assetId})`,
  assetDescription = undefined,
  assetHierarchies = [],
  assetProperties = [],
  assetCompositeModels = [],
  assetStatus = undefined,
  assetCreationDate = new Date(0),
  assetLastUpdateDate = new Date(0),
}: Partial<AssetDescription> = {}) {
  return {
    assetModelId,
    assetId,
    assetArn,
    assetName,
    assetDescription,
    assetHierarchies,
    assetProperties,
    assetCompositeModels,
    assetStatus,
    assetCreationDate,
    assetLastUpdateDate,
  } as const satisfies AssetDescription;
}
