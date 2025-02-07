import { createContext, useContext } from 'react';
import type { DashboardIotSiteWiseClients } from '~/features/queries/sdk-clients';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

export type DashboardClientContext = DashboardIotSiteWiseClients;

export const ClientContext = createContext<Partial<DashboardClientContext>>({});

export const useClients = () => useContext(ClientContext);

export function useIoTSiteWiseClient(): IoTSiteWiseClient {
  const iotSiteWiseClient = useContext(ClientContext).iotSiteWiseClient;

  invariant(
    iotSiteWiseClient,
    'Expected IoTSiteWiseClient instance to be defined.'
  );

  return iotSiteWiseClient;
}
