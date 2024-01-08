import { createContext, useContext } from 'react';
import { DashboardIotSiteWiseClients } from '~/types';

export const ClientContext = createContext<
  Partial<DashboardIotSiteWiseClients>
>({});

export const useClients = () => useContext(ClientContext);
