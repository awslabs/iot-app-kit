import { IoTSiteWiseClient, ListTimeSeriesCommand } from '@aws-sdk/client-iotsitewise';

const client = new IoTSiteWiseClient({
  region: 'us-east-1',
});

const dataStreamTypeToTimeSeriesTypeMap = {
  ALL: undefined,
  MODELED: 'ASSOCIATED',
  UNMODELED: 'DISASSOCIATED',
};

interface ListDataStreamsInput {
  dataStreamType: 'ALL' | 'MODELED' | 'UNMODELED';
  pageSize: number;
  nextToken?: string;
}

export async function listDataStreams(input: ListDataStreamsInput) {
  const command = new ListTimeSeriesCommand({
    timeSeriesType: dataStreamTypeToTimeSeriesTypeMap[input.dataStreamType],
    maxResults: input.pageSize,
    nextToken: input.nextToken,
  });
  const response = await client.send(command);

  return {
    timeSeries: response.TimeSeriesSummaries ?? [],
    nextToken: response.nextToken,
  };
}
