import {
  DateRangePicker,
  type DateRangePickerProps,
  FormField,
} from '@cloudscape-design/components';
import { type Viewport, registerPlugin } from '@iot-app-kit/core';
import {
  dateRangeToViewport,
  rangeValidator,
  viewportToDateRange,
} from '@iot-app-kit/core-util';
import { type Meta, type StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DashboardView from '~/components/dashboard/view';
import { type RefreshRate } from '~/components/refreshRate/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { Dashboard } from '../../src/index';
import { type DashboardConfiguration } from '../../src/types';
import { MOCK_DASHBOARD_CONFIG } from './mockData';

const displaySettings = {
  numColumns: 100,
  numRows: 100,
};

const defaultViewport = { duration: '10m' };
const querySettings = { refreshRate: 5000 as RefreshRate };

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
  args: {
    clientConfiguration: {
      awsCredentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      awsRegion: DEFAULT_REGION,
    },
  },
  // Applies to all stories under Mocked data
  decorators: [
    (Story) => {
      useWorker();
      return <Story />;
    },
  ],
} satisfies Meta<typeof Dashboard>;

type Story = StoryObj<typeof Dashboard>;

const ViewportPicker = (props: {
  onChangeValue: (value: DateRangePickerProps.Value) => void;
  viewport?: Viewport;
}) => {
  const { control, setValue, clearErrors } = useForm<{
    currentViewport: Viewport | undefined;
  }>({
    mode: 'onChange',
  });

  useEffect(() => {
    clearErrors();
  }, [clearErrors, setValue]);

  return (
    <Controller
      control={control}
      name='currentViewport'
      render={({ field, fieldState }) => {
        return (
          <FormField label='asjdalksdlka' errorText={fieldState.error?.message}>
            <DateRangePicker
              expandToViewport={true}
              onChange={({ detail: { value } }) => {
                if (!value) return;
                field.onChange(value);
                props.onChangeValue(value);
              }}
              value={viewportToDateRange(props.viewport)}
              showClearButton={false}
              relativeOptions={[]}
              isValidRange={rangeValidator({
                dateRangeIncompleteError: 'no',
                dateRangeInvalidError: 'yes no',
              })}
            />
          </FormField>
        );
      }}
    />
  );
};

export const EditableDashboard: Story = {
  render: function EditableDashboard(_story, { args }) {
    const [viewmode, setViewmode] = useState<'edit' | 'preview'>('edit');
    const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
    const [dashboardConfiguration, setDashboardConfiguration] =
      useState<DashboardConfiguration>({
        displaySettings,
        defaultViewport,
        widgets: [],
        querySettings,
      });

    const onViewportChange = (v: Viewport) => {
      console.log('### onViewportChange', v);
      setViewport(v);
    };
    const onConfigChange = (config: DashboardConfiguration) => {
      console.log('### onConfigChange', config);
      setDashboardConfiguration(config);
    };

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
            onClick={() =>
              setViewmode(viewmode === 'edit' ? 'preview' : 'edit')
            }
          >
            viewmode
          </button>
          <ViewportPicker
            viewport={viewport}
            onChangeValue={(value: DateRangePickerProps.Value) => {
              setViewport(dateRangeToViewport(value));
            }}
          />
        </div>
      );
    };

    return (
      <Dashboard
        {...args}
        dashboardConfiguration={dashboardConfiguration}
        initialViewMode={viewmode}
        currentViewport={viewport}
        onViewportChange={onViewportChange}
        toolbar={customToolbar}
        onDashboardConfigurationChange={onConfigChange}
      />
    );
  },
};

export const ViewOnlyDashboard: Story = {
  render: function ViewOnlyDashboard(_story, { args }) {
    const [viewport, setViewport] = useState<Viewport | undefined>(undefined);

    const onViewportChange = (v: Viewport) => {
      console.log('### onViewportChange', v);
      setViewport(v);
    };

    const customToolbar = () => {
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
          CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE
          ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW
          MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN
          VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM
          TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE
          ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW
          MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN
          VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM
          TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE
          ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️
          <ViewportPicker
            viewport={viewport}
            onChangeValue={(value: DateRangePickerProps.Value) => {
              setViewport(dateRangeToViewport(value));
            }}
          />
        </div>
      );
    };

    return (
      <DashboardView
        {...args}
        dashboardConfiguration={MOCK_DASHBOARD_CONFIG}
        currentViewport={viewport}
        onViewportChange={onViewportChange}
        toolbar={customToolbar}
      />
    );
  },
};
