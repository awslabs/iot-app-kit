import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { createContext, useContext } from 'react';
import type { DashboardIotSiteWiseClients } from '~/types';

export interface DashboardClientContext extends DashboardIotSiteWiseClients {
  iotSiteWise: IoTSiteWise;
}

// casting because they will always be defined
export const ClientContext = createContext<DashboardClientContext>(
  {} as DashboardClientContext
);

export const useClients = () => useContext(ClientContext);
