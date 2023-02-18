import { BatchPutAssetPropertyValueCommand, BatchPutAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';
import { useContext } from 'react';
import { ClientContext } from '~/components/dashboard/clientContext';

const useUpdateAssetPropertyValue = () => {
  const client = useContext(ClientContext);

  return ({
    assetId,
    propertyId,
    propertyAlias,
    value,
  }: {
    assetId: string;
    propertyId: string;
    propertyAlias?: string;
    value: string;
  }): Promise<BatchPutAssetPropertyValueResponse | undefined> => {
    if (!client) return Promise.resolve(undefined);
    return client.send(
      new BatchPutAssetPropertyValueCommand({
        entries: [
          {
            entryId: 'inputWidget',
            assetId,
            propertyId,
            propertyAlias,
            propertyValues: [
              {
                value: {
                  stringValue: value,
                },
                timestamp: {
                  timeInSeconds: Math.round(Date.now() / 1000),
                },
              },
            ],
          },
        ],
      })
    );
  };
};

export default useUpdateAssetPropertyValue;
