import { createContext, useContext } from 'react';
import { DashboardIotSiteWiseQueries, IoTSiteWiseDataStreamQuery } from '~/types';

export const QueryContext = createContext<Partial<DashboardIotSiteWiseQueries>>({});

export const useQueries = ({ assets = [], properties = [] }: IoTSiteWiseDataStreamQuery = {}) => {
  const { iotSiteWiseQuery } = useContext(QueryContext);

  if (iotSiteWiseQuery == null || (assets.length === 0 && properties.length === 0)) {
    return [];
  }

  const queries = [iotSiteWiseQuery.timeSeriesData({ assets, properties })] ?? [];

  return queries;
};
