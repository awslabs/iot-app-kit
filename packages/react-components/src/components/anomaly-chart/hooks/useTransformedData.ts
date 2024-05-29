import { Viewport } from '@iot-app-kit/core';
import {
  AnomalyData,
  AnomalyDescription,
  DataSourceLoader,
} from '../../../data';
import { useSiteWiseAnomalyDataSource } from '../../../queries';
import { AnomalyChartWithData } from '../types';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

type UseTransformedDataOptions = AnomalyChartWithData & {
  loader: DataSourceLoader<AnomalyDescription, AnomalyData>;
  viewport?: Viewport;
};
export const useTransformedData = ({
  data,
  query,
  loader,
  viewport,
}: UseTransformedDataOptions) => {
  const {
    query: { assetId, predictionDefinitionId, ...anomalyQueryStyles },
    iotSiteWiseClient: client,
  } = query ?? { query: {} };
  // console.log(client?.config.credentials);
  const a = new IoTSiteWise({
    credentials: client?.config.credentials,
    region: client?.config.region,
  });
  const queryDataSource = useSiteWiseAnomalyDataSource({
    client: a,
    assetId,
    predictionDefinitionId,
    viewport,
    styles: anomalyQueryStyles,
  });
  const empty = !query && !data;
  const inputData = (query ? [queryDataSource] : data) ?? [];

  const transformedData = loader.transform([...inputData]).at(0);
  const description = loader.describe([...inputData]).at(0);
  const loading = inputData.some(({ state }) => state === 'loading');
  const error = inputData.some(
    ({ state }) => state === 'error' || state === 'failed'
  );

  return {
    data: transformedData,
    description,
    loading,
    error,
    empty,
  };
};
