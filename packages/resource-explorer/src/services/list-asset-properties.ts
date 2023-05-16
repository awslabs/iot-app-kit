import { describeAsset } from "./describe-asset";

interface ListAssetPropertiesInput {
  assetId: string;
}

export async function listAssetProperties(input: ListAssetPropertiesInput) {
  const asset = await describeAsset(input);
  return asset.assetProperties ?? [];
}
