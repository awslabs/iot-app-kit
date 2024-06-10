import React, { useState } from 'react';
import { Viewport, registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard, { DashboardProperties } from '../../src/components/dashboard';
import {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '../../src/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { RefreshRate } from '~/components/refreshRate/types';

/**
 * Data is mocked by the service worker started above.
 * No need for real credentials, but the region must match.
 */
const clientConfiguration: DashboardClientConfiguration = {
  awsCredentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  awsRegion: DEFAULT_REGION,
};

const displaySettings = {
  numColumns: 100,
  numRows: 100,
};

const defaultViewport = { duration: '10m' };
const querySettings = { refreshRate: 5000 as RefreshRate };

const emptyDashboardConfiguration: DashboardProperties = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    defaultViewport,
    widgets: [],
    querySettings,
  },
  onSave: () => Promise.resolve(),
};

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

export default {
  title: 'Dashboard/Mocked data with Custom Toolbar',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  // Applies to all stories under Mocked data
  decorators: [
    (Story) => {
      useWorker();
      return <Story />;
    },
  ],
} as ComponentMeta<typeof Dashboard>;

export const Empty: ComponentStory<typeof Dashboard> = () => {
  const [viewmode, setViewmode] = useState<'edit' | 'preview'>('edit');

  const customToolbar = ({
    viewmode,
  }: {
    viewmode: 'preview' | 'edit';
    dashboardConfiguration: DashboardConfiguration;
    viewport?: Viewport;
  }) => {
    return (
      <div
        style={{
          color: 'pink',
          fontWeight: 'bold',
          height: '20px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {viewmode === 'edit'
          ? 'CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨ CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨CUSTOM TOOLBAR IN EDIT MODE! ✨✨✨✨'
          : 'CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️'}
        <button
          onClick={() => setViewmode(viewmode === 'edit' ? 'preview' : 'edit')}
        >
          Change viewmode
        </button>
      </div>
    );
  };

  return (
    <Dashboard
      {...emptyDashboardConfiguration}
      initialViewMode={viewmode}
      toolbar={customToolbar}
    />
  );
};
