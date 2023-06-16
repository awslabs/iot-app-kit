import { type AssetProperty } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';

/** Create an IoT asset property stub to use for testing. Configure it for your test, or don't! */
export function createAssetPropertyStub({
  id = uuid(),
  name = `Test Asset Property (${id})`,
  alias = undefined,
  unit = undefined,
  dataType = 'INTEGER',
  dataTypeSpec = undefined,
}: Partial<AssetProperty> = {}) {
  return {
    id,
    alias,
    name,
    unit,
    dataType,
    dataTypeSpec,
  } as const satisfies AssetProperty;
}
