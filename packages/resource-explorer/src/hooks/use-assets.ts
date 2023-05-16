import { useInfiniteQuery } from "@tanstack/react-query";

import { useAllAssetModels } from "./use-all-asset-models";
import { createAssetViewModel } from "../helpers/transforms";
import { listAssets } from "../services/list-assets";

interface UseAssetsProps {
  assetModelId?: string;
  pageSize: number;
}

const ASSETS_QUERY_KEY = ["resources", "sitewise", "assets"];

function createQueryKey(assetModelId?: string) {
  return [...ASSETS_QUERY_KEY, assetModelId ?? "root"] as const;
}

export function useAssets({ assetModelId, pageSize }: UseAssetsProps) {
  const { data: assetModels = [] } = useAllAssetModels();

  return useInfiniteQuery({
    enabled: assetModels.length > 0,
    queryKey: createQueryKey(assetModelId),
    queryFn: async ({ pageParam }) => {
      const { assets, nextToken } = await listAssets({
        assetModelId,
        pageSize,
        nextToken: pageParam,
      });

      return {
        assets: assets.map(createAssetViewModel(assetModels)),
        nextToken,
      };
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}
