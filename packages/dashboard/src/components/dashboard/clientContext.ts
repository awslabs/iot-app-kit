import { createContext, useContext } from 'react';
import type { DashboardIotSiteWiseClients } from '~/types/sdk-clients';

export type DashboardClientContext = DashboardIotSiteWiseClients;

export const ClientContext = createContext<Partial<DashboardClientContext>>({});

export const useClients = () => useContext(ClientContext);
