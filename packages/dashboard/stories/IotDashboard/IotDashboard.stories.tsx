import React, { useState, useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createMockSiteWiseSDK, createMockIoTEventsSDK, initialize } from '@iot-app-kit/source-iotsitewise';
import IotDashboard from '../../src/components/dashboard';
import { mockListAssets, mockListAssociatedAssets } from './mockData';

export default {
  title: 'IotDashboard',
  component: IotDashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof IotDashboard>;

const iotSiteWiseClient = createMockSiteWiseSDK({
  listAssets: mockListAssets as any,
  listAssociatedAssets: mockListAssociatedAssets as any,
});

export const Main: ComponentStory<typeof IotDashboard> = () => {
  const [query, setQuery] = useState(undefined as any);

  useEffect(() => {
    const { query } = initialize({
      iotSiteWiseClient,
      iotEventsClient: createMockIoTEventsSDK(),
    });
    if (!query) return;
    setQuery(query);
  }, []);

  return (
    <IotDashboard
      query={query}
      dashboardConfiguration={{
        widgets: [],
        viewport: { duration: '5m' },
      }}
    />
  );
};
