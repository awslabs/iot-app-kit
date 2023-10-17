import { createContext, useContext } from 'react';
import { assetModelQueryToSiteWiseAssetQuery } from '~/customization/widgets/utils/assetModelQueryToAssetQuery';
import { DashboardIotSiteWiseQueries, IoTSiteWiseDataStreamQuery } from '~/types';

export const QueryContext = createContext<Partial<DashboardIotSiteWiseQueries>>({});

export const useQueries = ({ assets = [], properties = [], assetModels = [] }: IoTSiteWiseDataStreamQuery = {}) => {
  const { iotSiteWiseQuery } = useContext(QueryContext);

  if (iotSiteWiseQuery == null || (assets.length === 0 && properties.length === 0 && assetModels.length === 0)) {
    return [];
  }

  const mappedQuery = assetModelQueryToSiteWiseAssetQuery({ assetModels, assets, properties });

  const queries = [iotSiteWiseQuery.timeSeriesData(mappedQuery)] ?? [];

  return queries;
};
