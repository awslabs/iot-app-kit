import React from 'react';
import { Gauge } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from '../gauge/mock-data';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from '../../src/components/gauge/constants';
import { GaugeSettings } from '../../src/components/gauge/types';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import useDataStore from '../../src/store';
import { MockInvokeAssistant } from '../assistant-chatbot/mockAPI';

export default {
  title: 'Widgets/Assistant Action Panel',
  component: Gauge,
  argTypes: {
    gaugeThickness: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.gaugeThickness,
    },
    color: {
      control: { type: 'color' },
      defaultValue: DEFAULT_GAUGE_PROGRESS_COLOR,
    },
    showName: {
      control: { type: 'boolean' },
      defaultValue: DEFAULT_GAUGE_STYLES.showName,
    },
    showUnit: {
      control: { type: 'boolean' },
      defaultValue: DEFAULT_GAUGE_STYLES.showUnit,
    },
    fontSize: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.fontSize,
    },
    unitFontSize: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.unitFontSize,
    },
    yMin: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.yMin,
    },
    yMax: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.yMax,
    },
    size: {
      control: { type: 'object' },
      defaultValue: { width: 400, height: 300 },
    },
    significantDigits: { control: { type: 'number' }, defaultValue: 2 },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Gauge>;

export const DefaultGauge: ComponentStory<typeof Gauge> = ({
  size,
  significantDigits,
  ...settings
}) => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  const storeState = useDataStore.getState();
  storeState.clearAssistantState();
  return (
    <div style={{ padding: '80px 20px' }}>
      <Gauge
        viewport={{ duration: '5m' }}
        size={size}
        significantDigits={significantDigits}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings as GaugeSettings}
        assistant={{
          client,
          conversationID: crypto.randomUUID(),
        }}
      />
      <div
        style={{
          display: 'flex',
          background: 'grey',
          height: '200px',
          width: '350px',
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <span
          style={{
            padding: '10px',
            marginRight: '10px',
            background: 'white',
          }}
        >
          fake component just to test assistant action panel behavior on a small
          component
        </span>
        <Gauge
          viewport={{ duration: '5m' }}
          size={{ width: 200, height: 200 }}
          significantDigits={1}
          query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
          settings={settings as GaugeSettings}
          assistant={{
            client,
            conversationID: crypto.randomUUID(),
          }}
        />
      </div>
    </div>
  );
};
