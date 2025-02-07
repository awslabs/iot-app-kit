import {
  DescribeTimeSeriesCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

export const getDescribedTimeSeries = async ({
  client,
  assetId,
  propertyId,
  alias,
}: {
  client: IoTSiteWiseClient;
  assetId?: string;
  propertyId?: string;
  alias?: string;
}) => {
  invariant(
    Boolean(alias) || (Boolean(assetId) && Boolean(propertyId)),
    'Expected alias or assetID+propertyID to be defined as required by the enabled flag.'
  );

  const params = { assetId, propertyId, alias };
  const command = new DescribeTimeSeriesCommand(params);

  try {
    const data = await client.send(command);
    return { data, hasError: false };
  } catch (error) {
    console.error(`Failed to get described time series. Error: ${error}`);
    console.info('Request input:');
    console.table(params);

    return { data: undefined, hasError: true };
  }
};
