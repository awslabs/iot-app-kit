import { useQuery } from '@tanstack/react-query';
import { type RequestFunction, type RequestFunctionResponse } from '~/types';
import {
  DescribeAssetPropertyCommand,
  type DescribeAssetPropertyRequest,
  type DescribeAssetPropertyResponse,
} from '@aws-sdk/client-iotsitewise';
import { useIoTSiteWiseClient } from '~/components/dashboard/clientContext';

export type DescribeAssetProperty = RequestFunction<
  DescribeAssetPropertyRequest,
  DescribeAssetPropertyResponse
>;

export interface UseModeledDataStreamOptions {
  assetId: string;
  propertyId: string;
}

export interface UseModeledDataStreamResult {
  modeledDataStream: RequestFunctionResponse<DescribeAssetProperty> | undefined;
}

export function useModeledDataStream({
  assetId,
  propertyId,
}: UseModeledDataStreamOptions): UseModeledDataStreamResult {
  const iotSiteWiseClient = useIoTSiteWiseClient();

  const { data: modeledDataStream } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const command = new DescribeAssetPropertyCommand({ assetId, propertyId });
      const response = await iotSiteWiseClient.send(command);

      return response as RequestFunctionResponse<DescribeAssetProperty>;
    },
  });

  return { modeledDataStream };
}
