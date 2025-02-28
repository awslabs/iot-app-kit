import { useState } from 'react';

import type { AssetResource } from '../../types/resources';

export type UseParentAssetResult = readonly [
  AssetResource | undefined,
  (asset?: AssetResource) => void
];

/** Use a parent asset resource. */
export function useParentAsset(): UseParentAssetResult {
  const [parentAsset, setParentAsset] = useState<AssetResource | undefined>();

  return [parentAsset, setParentAsset];
}
