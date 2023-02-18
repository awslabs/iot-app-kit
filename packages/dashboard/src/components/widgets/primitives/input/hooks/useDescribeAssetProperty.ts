import { DescribeAssetPropertyResponse, DescribeAssetPropertyCommand } from '@aws-sdk/client-iotsitewise';
import { useContext } from 'react';
import { ClientContext } from '~/components/dashboard/clientContext';

const useDescribeAssetProperty = () => {
  const client = useContext(ClientContext);

  return ({
    assetId,
    propertyId,
  }: {
    assetId: string;
    propertyId: string;
  }): Promise<DescribeAssetPropertyResponse | undefined> => {
    if (!client) return Promise.resolve(undefined);
    return client.send(new DescribeAssetPropertyCommand({ assetId, propertyId }));
  };
};

export default useDescribeAssetProperty;
