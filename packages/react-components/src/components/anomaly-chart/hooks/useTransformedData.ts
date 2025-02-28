import { type Viewport } from '@iot-app-kit/core';
import {
  type AnomalyData,
  type AnomalyDescription,
  type DataSourceLoader,
} from '@iot-app-kit/component-core';
import { useSiteWiseAnomalyDataSource } from '@iot-app-kit/component-core';
import { type AnomalyChartWithData } from '../types';

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
  const queryDataSource = useSiteWiseAnomalyDataSource({
    client,
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
