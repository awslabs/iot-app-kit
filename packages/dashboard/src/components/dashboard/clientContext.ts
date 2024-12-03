import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { createContext, useContext } from 'react';
import { type DashboardIotSiteWiseClients } from '../../types';

export interface DashboardClientContext extends DashboardIotSiteWiseClients {
  iotSiteWise: IoTSiteWise;
}

export const ClientContext = createContext<Partial<DashboardClientContext>>({});

export const useClients = () => useContext(ClientContext);
