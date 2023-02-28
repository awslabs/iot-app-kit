import { AssetPropertySummary, IoTSiteWiseClient, ListAssetPropertiesCommand } from '@aws-sdk/client-iotsitewise';
import { HIERARCHY_ROOT_ID } from './nextResourceExplorer';
import { ExtendedPanelAssetSummary } from './nextResourceExplorer';
import { DashboardMessages } from '~/messages';

export const sendCommand = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new ListAssetPropertiesCommand({ assetId }));

export const getCurrentAssetProperties = async (
  currentBranchId: string,
  messageOverrides: DashboardMessages,
  client: IoTSiteWiseClient | undefined
) => {
  if (!client) return [];

  const assetPropertiesHeaderItem = {
    id: messageOverrides.resourceExplorer.assetPropertiesHeader,
    name: messageOverrides.resourceExplorer.assetPropertiesHeader,
    isHeader: true,
    isAssetProperty: false,
    queryAssetsParam: [],
  };

  const listAssetProperties = async (assetId: string) => {
    const response = await sendCommand(client, assetId);
    return response;
  };

  // Do not attempt to retrieve properties for the root asset
  if (currentBranchId === HIERARCHY_ROOT_ID) return [];

  try {
    // Attempt to get assetProperties. Return nothing if this fails.
    const assetProperties = await listAssetProperties(currentBranchId);
    if (!assetProperties?.assetPropertySummaries) return [];

    // Filter out unaliased properties. Return nothing if none are aliased.
    const assetPropertyItemsWithAlias = assetProperties.assetPropertySummaries.filter(
      ({ alias }: AssetPropertySummary) => !!alias
    );
    if (assetPropertyItemsWithAlias.length === 0) return [];

    // Format for the side panel.
    const assetPropertyItems = assetPropertyItemsWithAlias.map(({ id, alias }: AssetPropertySummary) => ({
      isAssetProperty: true,
      id,
      name: alias,
      // An `assets` param for this asset property ready to be passed
      // to an AWS IoT SiteWise Source query. See:
      // https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTSiteWiseSource.md
      queryAssetsParam: [
        {
          assetId: currentBranchId,
          properties: [
            {
              propertyId: id,
            },
          ],
        },
      ],
    })) as ExtendedPanelAssetSummary[];

    // Add the header item and return.
    assetPropertyItems.unshift(assetPropertiesHeaderItem);
    return assetPropertyItems;
  } catch (err) {
    console.log(err);
    return [];
  }
};
