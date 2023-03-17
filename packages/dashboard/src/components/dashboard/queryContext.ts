import { createContext, useContext } from 'react';
import { DashboardIotSiteWiseQueries } from '~/types';

export const QueryContext = createContext<Partial<DashboardIotSiteWiseQueries>>({});

export const useQueries = () => useContext(QueryContext);
