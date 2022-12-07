import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IotDashboard, { IotDashboardProps } from '../src/components/dashboard';
import { query } from '../testing/siteWiseQueries';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'IotDashboard',
  component: IotDashboard,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof IotDashboard>;

const args = {
  dashboardConfiguration: {
    widgets: [],
    viewport: { duration: '5m' },
    query: query,
  },
} as IotDashboardProps;

export const Main: ComponentStory<typeof IotDashboard> = () => <IotDashboard {...args} />;
