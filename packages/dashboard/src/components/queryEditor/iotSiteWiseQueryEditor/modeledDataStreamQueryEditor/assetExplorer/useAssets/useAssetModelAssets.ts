import {
  IoTSiteWiseClient,
  ListAssetsCommand,
} from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery } from '@tanstack/react-query';

export interface UseAssetModelAssetsOptions {
  assetModelId?: string;
  client: IoTSiteWiseClient;
}

export function useAssetModelAssets({
  assetModelId,
  client,
}: UseAssetModelAssetsOptions) {
  const { data: { pages: assetPages = [] } = {} } = useInfiniteQuery({
    enabled: assetModelId != null,
    queryKey: ['asset model assets', assetModelId],
    queryFn: ({ pageParam: nextToken }) => {
      const command = new ListAssetsCommand({ assetModelId, nextToken });
      const output = client.send(command);

      return output;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const assets = assetPages.flatMap(
    ({ assetSummaries = [] }) => assetSummaries
  );

  return { assets };
}
