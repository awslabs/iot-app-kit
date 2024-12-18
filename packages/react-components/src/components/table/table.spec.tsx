import type { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import cloudscapeWrapper from '@cloudscape-design/components/test-utils/dom';
import type { DataStream } from '@iot-app-kit/core';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { act, render, renderHook } from '@testing-library/react';
import ue from '@testing-library/user-event';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { Table } from './table';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
};

const query = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: vi.fn(),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  enabled: true,
  componentId: 'componentId',
  onAction: (_event: AssistantActionEventDetail) => vi.fn(),
  conversationId: 'conversationId',
  target: 'widget',
  client,
} as AssistantProperty;

it('renders', async () => {
  expect(() => {
    render(
      <Table
        columnDefinitions={[]}
        items={[]}
        queries={[query]}
        viewport={VIEWPORT}
      />
    );
  }).not.toThrowError();
});

it('renders with assistant action panel', async () => {
  expect(() => {
    render(
      <Table
        columnDefinitions={[]}
        items={[]}
        queries={[query]}
        viewport={VIEWPORT}
        assistant={assistant}
      />
    );
  }).not.toThrowError();
});

it('pass context to the assistant', async () => {
  const user = ue.setup();
  const { result } = renderHook(() => useAssistantContext());
  const { getByRole } = render(
    <Table
      columnDefinitions={[]}
      items={[
        {
          value1: {
            $cellRef: {
              id: 'abc-1',
              resolution: 0,
            },
          },
        },
      ]}
      queries={[query]}
      viewport={VIEWPORT}
      assistant={assistant}
    />
  );

  act(() => {
    cloudscapeWrapper().findTable()?.findRowSelectionArea(1)?.click();
  });

  expect(getByRole('button', { name: 'Generate Summary' })).toBeInTheDocument();
  await user.click(getByRole('button', { name: 'Generate Summary' }));

  const context = result.current.getAllAssistantContext();
  expect(context).toContain('timerange');
  expect(context).toContain('queries');
});
