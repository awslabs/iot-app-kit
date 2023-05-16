import { useQuery } from "@tanstack/react-query";

import { createAssetModelViewModel } from "../helpers/transforms";
import { listAllAssetModels } from "../services/list-all-asset-models";

const ASSET_MODELS_QUERY_KEY = ["resources", "sitewise", "asset models", "all"];

export function useAllAssetModels() {
  return useQuery({
    queryKey: ASSET_MODELS_QUERY_KEY,
    queryFn: async () => {
      const assetModels = await listAllAssetModels();
      return assetModels.map(createAssetModelViewModel);
    },
  });
}
