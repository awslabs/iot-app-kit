import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';

/** Create an IoT asset summary stub to use for testing. Configure it for your test, or don't! */
export function createAssetSummaryStub({
  assetModelId = uuid(),
  id = uuid(),
  arn = `arn:aws:iotsitewise:us-east-1:123456789012:asset/${id}`,
  name = `Test Asset Summary (${id})`,
  hierarchies = [],
  status = undefined,
  creationDate = new Date(0),
  lastUpdateDate = new Date(0),
}: Partial<AssetSummary> = {}) {
  return {
    assetModelId,
    id,
    arn,
    name,
    hierarchies,
    status,
    creationDate,
    lastUpdateDate,
  } as const satisfies AssetSummary;
}
