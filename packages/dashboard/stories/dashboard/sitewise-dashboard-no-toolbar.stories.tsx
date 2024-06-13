import React, { useEffect, useState } from 'react';
import { Viewport, registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dashboard, DashboardView } from '../../src';
import { REGION } from '../../testing/siteWiseQueries';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '../../src/types';
import {
  DateRangePicker,
  DateRangePickerProps,
  FormField,
} from '@cloudscape-design/components';
import {
  dateRangeToViewport,
  rangeValidator,
  viewportToDateRange,
} from '@iot-app-kit/core-util';
import { Controller, useForm } from 'react-hook-form';

const DASHBOARD_STORAGE_NAMESPACE = 'connected-dashboard';

const DEFAULT_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
  },
  widgets: [],
  defaultViewport: { duration: '10m' },
};

const CLIENT_CONFIGURATION: DashboardClientConfiguration = {
  awsCredentials: getEnvCredentials(),
  awsRegion: REGION,
};

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

const getInitialDashboardConfig = (): DashboardConfiguration => {
  const cachedDashboardConfiguration = window.localStorage.getItem(
    DASHBOARD_STORAGE_NAMESPACE
  );
  const dashboardConfiguration = cachedDashboardConfiguration
    ? JSON.parse(cachedDashboardConfiguration)
    : {};

  return {
    ...DEFAULT_DASHBOARD_CONFIG,
    ...dashboardConfiguration,
  };
};

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

export const Main: ComponentStory<typeof Dashboard> = () => {
  const [dashboardConfig, setDashboardConfig] = useState(
    getInitialDashboardConfig()
  );
  const [initialViewMode, setInitialViewMode] = useState<'preview' | 'edit'>(
    'edit'
  );
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
  // on save not only updates local storage but forces the dashboard to reload given the updated config
  // this is done to more realistically match the dashboard implementation in iot-application
  const onSave = async (
    dashboard: DashboardConfiguration,
    viewModeOnSave?: 'preview' | 'edit'
  ) => {
    viewModeOnSave && setInitialViewMode(viewModeOnSave);
    window.localStorage.setItem(
      DASHBOARD_STORAGE_NAMESPACE,
      JSON.stringify(dashboard)
    );
    return new Promise(() => setDashboardConfig(dashboard)) as Promise<void>;
  };

  const onViewportChange = (v: Viewport) => setViewport(v);

  return (
    <div>
      <ViewportPicker
        viewport={viewport}
        onChangeValue={(value: DateRangePickerProps.Value) => {
          setViewport(dateRangeToViewport(value));
        }}
      />
      <Dashboard
        clientConfiguration={CLIENT_CONFIGURATION}
        onSave={onSave}
        initialViewMode={initialViewMode}
        dashboardConfiguration={dashboardConfig}
        currentViewport={viewport}
        onViewportChange={onViewportChange}
      />
    </div>
  );
};

export const View: ComponentStory<typeof DashboardView> = () => (
  <DashboardView
    clientConfiguration={CLIENT_CONFIGURATION}
    dashboardConfiguration={getInitialDashboardConfig()}
  />
);

export default {
  title: 'Dashboard/SiteWise Connected No Toolbar',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;
