import { createContext } from 'react';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
export const ClientContext = createContext<IoTSiteWiseClient | undefined>(undefined);
