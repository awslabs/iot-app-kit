import { useQuery } from "@tanstack/react-query";

import { createAssetPropertyViewModel } from "../helpers/transforms";
import { listAssetProperties } from "../services/list-asset-properties";

const ASSET_PROPERTIES_QUERY_KEY = [
  "resources",
  "sitewise",
  "asset properties",
];

export function useAssetProperties(assetId: string) {
  return useQuery({
    queryKey: ASSET_PROPERTIES_QUERY_KEY,
    queryFn: async () => {
      const assetProperties = await listAssetProperties({ assetId });
      return assetProperties.map(createAssetPropertyViewModel);
    },
  });
}
