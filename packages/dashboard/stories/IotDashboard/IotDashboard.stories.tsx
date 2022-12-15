import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IotDashboard, { IotDashboardProps } from '../../src/components/dashboard';
import { query } from '../../testing/siteWiseQueries';

export default {
  title: 'IotDashboard',
  component: IotDashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof IotDashboard>;

const args = {
  dashboardConfiguration: {
    widgets: [],
    viewport: { duration: '5m' },
  },
  query,
} as IotDashboardProps;

export const Main: ComponentStory<typeof IotDashboard> = () => <IotDashboard {...args} />;
