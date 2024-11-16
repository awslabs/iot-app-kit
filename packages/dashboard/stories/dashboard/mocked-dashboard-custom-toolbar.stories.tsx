import { useEffect, useState } from 'react';
import { type Viewport, registerPlugin } from '@iot-app-kit/core';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';

import { Dashboard } from '../../src/index';
import {
  type DashboardClientConfiguration,
  type DashboardConfiguration,
} from '../../src/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { type RefreshRate } from '~/components/refreshRate/types';
import {
  DateRangePicker,
  type DateRangePickerProps,
  FormField,
} from '@cloudscape-design/components';
import { Controller, useForm } from 'react-hook-form';
import {
  dateRangeToViewport,
  rangeValidator,
  viewportToDateRange,
} from '@iot-app-kit/core-util';
import DashboardView from '~/components/dashboard/view';
import { MOCK_DASHBOARD_CONFIG } from './mockData';

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

const emptyDashboardConfiguration = {
  clientConfiguration,
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

export const EditableDashboard: ComponentStory<typeof Dashboard> = () => {
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
          onClick={() => setViewmode(viewmode === 'edit' ? 'preview' : 'edit')}
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
      {...emptyDashboardConfiguration}
      dashboardConfiguration={dashboardConfiguration}
      initialViewMode={viewmode}
      currentViewport={viewport}
      onViewportChange={onViewportChange}
      toolbar={customToolbar}
      onDashboardConfigurationChange={onConfigChange}
    />
  );
};

export const ViewOnlyDashboard: ComponentStory<typeof DashboardView> = () => {
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
        VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR
        IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM
        TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE
        ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW
        MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN
        VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR IN VIEW MODE ❤️❤️❤️❤️❤️CUSTOM TOOLBAR
        IN VIEW MODE ❤️❤️❤️❤️❤️
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
      {...emptyDashboardConfiguration}
      dashboardConfiguration={MOCK_DASHBOARD_CONFIG}
      currentViewport={viewport}
      onViewportChange={onViewportChange}
      toolbar={customToolbar}
    />
  );
};
