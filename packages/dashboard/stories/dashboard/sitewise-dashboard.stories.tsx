import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard, { DashboardProps } from '../../src/components/dashboard';
import { REGION } from '../../testing/siteWiseQueries';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import { DashboardClientConfiguration } from '../../src/types';

const getDashboardProps = (defaultProps: DashboardProps): DashboardProps => {
  const cachedDashboard = window.localStorage.getItem('dashboard');
  const dashboard = cachedDashboard ? JSON.parse(cachedDashboard) : defaultProps;

  return {
    ...defaultProps,
    ...dashboard,
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

const args = {
  clientConfiguration,
  dashboardConfiguration: {
    widgets: [],
    viewport: { duration: '5m' },
  },
  onSave: (dashboard) => {
    window.localStorage.setItem('dashboard', JSON.stringify(dashboard));
    return Promise.resolve();
  },
} as DashboardProps;

export const Main: ComponentStory<typeof Dashboard> = () => <Dashboard {...getDashboardProps(args)} />;
