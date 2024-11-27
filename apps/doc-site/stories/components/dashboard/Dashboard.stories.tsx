import { registerPlugin } from '@iot-app-kit/core';
import { Dashboard } from '@iot-app-kit/dashboard';
import { type Meta, type StoryObj } from '@storybook/react';
import { DEFAULT_REGION } from '../../../msw/constants';
import { useWorker } from '../../../msw/useWorker';
// import { MOCK_DASHBOARD_CONFIG } from './mockData';

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

const meta = {
  title: 'Components/Dashboard',
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
  // Applies to all stories under Mocked data
  decorators: [
    (Story) => {
      useWorker();
      return <Story />;
    },
  ],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Empty: Story = {};
