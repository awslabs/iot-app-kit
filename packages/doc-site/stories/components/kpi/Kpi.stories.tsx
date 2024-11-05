import React, { useEffect } from 'react';
import { KPI, useAssistant } from '@iot-app-kit/react-components';
import {
  mockSinWaveData,
  mockSinWaveDataWithQuality,
  mockAlarmData,
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { Meta, StoryObj } from '@storybook/react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Components/Kpi',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveData('5s'),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
      backgroundColor: '#ffffff',
    }
  },
};

export const Alarm: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockAlarmData(),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
    }
  },
};

export const Error: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Loading: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Empty: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQuery([]),
  },
};

export const UncertainDataQuality: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'UNCERTAIN',
    }),
    settings: {
      showDataQuality: true,
    }
  },
};

export const BadDataQuality: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
    settings: {
      showDataQuality: true,
    }
  },
};

export const SignificantDigits: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
    settings: {
      showDataQuality: true,
    },
    significantDigits: 2,
  },
};

const componentId = 'a8cdf292-8a1c-4809-9c9a-3485d88c447b';
const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: MockInvokeAssistant,
  },
  defaultContext: '',
});

export const Assistant: Story = {
  render: (props) => {
    const { generateSummary } = useAssistant({
      assistantClient: client,
    });

    useEffect(() => {
      generateSummary({
        componentId,
        conversationId: crypto.randomUUID(),
        target: 'widget',
        utterance: 'generate a summary and return the response in markdown format.',
      });
    }, []);

    return (
      <div style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}>
        <KPI
          {...props}
          assistant={{
            client,
            componentId,
            conversationId: 'mockConversationId',
            target: 'widget',
          }}
        />
      </div>
    )
  },
  args: {
    query: mockSinWaveData('5s'),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
      backgroundColor: '#ffffff',
    }
  },
};
