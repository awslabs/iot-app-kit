import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard from '../../src/components/dashboard';
import { mockQuery } from '../../testing/siteWiseQueries';

export default {
  title: 'E2EDashboardTest',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;

export const Empty: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      query: mockQuery(),
      onSave: () => {},
    }}
  />
);

export const SingleWidget: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      dashboardConfiguration: {
        widgets: [
          {
            componentTag: 'iot-line-chart',
            height: 15,
            width: 27,
            x: 5,
            y: 5,
            z: 0,
            assets: [],
          },
        ],
        viewport: { duration: '5m' },
      },
      query: mockQuery(),
      onSave: () => {},
    }}
  />
);
