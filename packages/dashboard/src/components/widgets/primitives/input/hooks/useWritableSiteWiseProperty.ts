import {
  DescribeAssetCommand,
  IoTSiteWiseClient,
  ListTagsForResourceCommand,
  ErrorDetails,
} from '@aws-sdk/client-iotsitewise';
import { useContext } from 'react';
import { ClientContext } from '~/components/dashboard/clientContext';

export const WRITABLE_TAG = 'iot-app-kit:writable';

const useWritableSiteWiseProperty = () => {
  const client = useContext(ClientContext);

  const describeAsset = (client: IoTSiteWiseClient, assetId: string) =>
    client.send(new DescribeAssetCommand({ assetId }));

  const getTags = (client: IoTSiteWiseClient, resourceArn: string | undefined) =>
    client.send(new ListTagsForResourceCommand({ resourceArn }));

  return async ({
    assetId,
    propertyId,
    propertyAlias,
  }: {
    assetId: string;
    propertyId: string;
    propertyAlias?: string;
  }): Promise<{ writable: boolean; error: string | undefined }> => {
    if (!client) return { writable: false, error: 'missing client' };
    let asset;
    let assetTags;

    try {
      asset = await describeAsset(client, assetId);
    } catch (e) {
      return { writable: false, error: (e as ErrorDetails).message };
    }

    try {
      assetTags = await getTags(client, asset.assetArn);
    } catch (e) {
      return { writable: false, error: (e as ErrorDetails).message };
    }

    const hasTag = Object.keys(assetTags?.tags ?? {}).includes(WRITABLE_TAG);

    // For now we will only support string properties
    const isStringProperty = asset.assetProperties?.some(
      ({ id, alias, dataType }) => (id === propertyId || alias === propertyAlias) && dataType === 'STRING'
    );

    if (!hasTag) {
      return { writable: false, error: `Asset is not writable. Add ${WRITABLE_TAG} tag to asset.` };
    } else if (!isStringProperty) {
      return { writable: false, error: 'Only supports string properties.' };
    } else {
      return { writable: true, error: undefined };
    }
  };
};

export default useWritableSiteWiseProperty;
