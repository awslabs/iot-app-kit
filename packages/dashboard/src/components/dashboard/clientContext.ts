import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { createContext, useContext } from 'react';
import { DashboardIotSiteWiseClients } from '~/types';

export interface DashboardClientContext extends DashboardIotSiteWiseClients {
  iotSiteWise: IoTSiteWise;
}

export const ClientContext = createContext<Partial<DashboardClientContext>>({});

export const useClients = () => useContext(ClientContext);
