import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard, { DashboardProperties } from '../../src/components/dashboard';
import { REGION } from '../../testing/siteWiseQueries';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import { DashboardClientConfiguration } from '../../src/types';
import { DashboardView } from '~/index';

const getDashboardProperties = (defaultProps: DashboardProperties): DashboardProperties => {
  const cachedDashboardConfiguration = window.localStorage.getItem('dashboard');
  const dashboardConfiguration = cachedDashboardConfiguration ? JSON.parse(cachedDashboardConfiguration) : defaultProps;

  return {
    ...defaultProps,
    dashboardConfiguration: {
      ...defaultProps.dashboardConfiguration,
      ...dashboardConfiguration,
    },
  };
};

export default {
  title: 'Dashboard/SiteWise Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;

const clientConfiguration: DashboardClientConfiguration = {
  awsCredentials: getEnvCredentials(),
  awsRegion: REGION,
};

const args: DashboardProperties = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings: {
      numColumns: 100,
      numRows: 100,
      cellSize: 20,
    },
    widgets: [],
    viewport: { duration: '5m' },
  },
  onSave: async (dashboard) => {
    console.log(dashboard);
    window.localStorage.setItem('dashboard', JSON.stringify(dashboard));
    return Promise.resolve();
  },
};

export const Main: ComponentStory<typeof Dashboard> = () => <Dashboard {...getDashboardProperties(args)} />;

export const View: ComponentStory<typeof DashboardView> = () => <DashboardView {...getDashboardProperties(args)} />;
