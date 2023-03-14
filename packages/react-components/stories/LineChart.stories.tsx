import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LineChart, WebglContext } from '../src/components';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DATA_TYPE, DataStream, TimeSeriesDataQuery } from '@iot-app-kit/core';

const DATA_STREAM: DataStream = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DATA_TYPE.NUMBER,
  data: [],
};
const VIEWPORT = { duration: '10s' };

export default {
  title: 'Widgets/LineChart/LineChart',
  component: LineChart,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LineChart>;

export const LineChartStory: ComponentStory<typeof LineChart> = () => {
  const [queries, setQueries] = useState<TimeSeriesDataQuery[]>([]);
  const [numStreams, setNumStreams] = useState(0);

  const addDataStreamToQuery = () => {
    const query = mockTimeSeriesDataQuery([
      {
        dataStreams: new Array(numStreams + 1).fill(0).map((_, i) => ({
          ...DATA_STREAM,
          data: [{ x: Date.now(), y: 100 * Math.random() }],
          name: `stream-${i}`,
          id: i.toString(),
        })),
        annotations: {},
        viewport: VIEWPORT,
      },
    ]);
    setQueries([query]);
    setNumStreams(numStreams + 1);
  };

  return (
    <div style={{ width: '500px', height: '200px' }}>
      <button
        onClick={() => {
          addDataStreamToQuery();
        }}
      >
        Add query
      </button>
      <LineChart viewport={VIEWPORT} queries={queries} />
      <WebglContext />
    </div>
  );
};
