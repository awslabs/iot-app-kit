import { registerPlugin } from '@iot-app-kit/core';
import { Dashboard } from '@iot-app-kit/dashboard';
import { DEFAULT_REGION } from '@iot-app-kit/data-mocked/constants';
import { type Meta, type StoryObj } from '@storybook/react';
import { MOCK_DASHBOARD_CONFIG } from './mockData';

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

const meta = {
  title: 'Dashboard/Mocked data',
  component: Dashboard,
  args: {
    clientConfiguration: {
      // MSW is being used to mock requests
      awsCredentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      awsRegion: DEFAULT_REGION,
    },
    dashboardConfiguration: {
      defaultViewport: { duration: '10m' },
      querySettings: { refreshRate: 5000 },
      displaySettings: {
        numColumns: 100,
        numRows: 100,
      },
      widgets: [],
    },
    onDashboardConfigurationChange: (config) => {
      console.log('dashboard config changed to: ', config);
    },
    onSave: () => Promise.resolve(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Dashboard>;
export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Empty: Story = {};

export const NoOptionalProps: Story = {
  args: {
    dashboardConfiguration: {
      displaySettings: {
        numColumns: 100,
        numRows: 100,
      },
      widgets: [],
    },
    onDashboardConfigurationChange: undefined,
    onSave: undefined,
  },
};

export const ViewOnly: Story = {
  args: {
    initialViewMode: 'preview',
    dashboardConfiguration: MOCK_DASHBOARD_CONFIG,
    assistantConfiguration: { state: 'PASSIVE' },
  },
};

export const ViewOnlyWithTimezone: Story = {
  args: {
    initialViewMode: 'preview',
    dashboardConfiguration: MOCK_DASHBOARD_CONFIG,
  },
};
