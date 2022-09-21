import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IotDashboard, { IotDashboardProps } from '../src/components/dashboard';

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
  },
} as IotDashboardProps;

export const Main: ComponentStory<typeof IotDashboard> = () => <IotDashboard {...args} />;
