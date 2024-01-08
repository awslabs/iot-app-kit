import {
  DescribeTimeSeriesCommand,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

const isEnabled = (input?: string): input is string => Boolean(input);

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
    isEnabled(alias) || (isEnabled(assetId) && isEnabled(propertyId)),
    'Expected alias or assetID+propertyID to be defined as required by the enabled flag.'
  );

  const params = { assetId, propertyId, alias };
  const command = new DescribeTimeSeriesCommand(params);

  try {
    const data = await client.send(command);
    return { data, isError: false };
  } catch (error) {
    console.error(`Failed to get described time series. Error: ${error}`);
    console.info('Request input:');
    console.table(params);

    return { data: undefined, isError: true };
  }
};
