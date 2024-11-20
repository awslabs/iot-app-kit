import type { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { render, renderHook, screen } from '@testing-library/react';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { Gauge } from './gauge';

const VIEWPORT = { duration: '5m' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'mock-data-stream',
  data: [{ x: new Date(2024, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  name: 'mock-name',
  unit: 'mph',
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
  onAction: (_event: AssistantActionEventDetail) => vi.fn(),
  componentId: 'componentId',
  conversationId: 'conversationId',
  target: 'widget',
  client,
} satisfies AssistantProperty;

it('renders', async () => {
  const element = render(<Gauge query={query} viewport={VIEWPORT} />);
  expect(element).not.toBeNull();
});

it('renders with assistant action panel', async () => {
  expect(() => {
    render(<Gauge query={query} viewport={VIEWPORT} assistant={assistant} />);
  }).not.toThrowError();
});

it('Gauge pass context to the assistant', () => {
  const { result } = renderHook(() => useAssistantContext());
  render(<Gauge query={query} viewport={VIEWPORT} assistant={assistant} />);

  const context = result.current.getAllAssistantContext();
  expect(context).toContain('timerange');
  expect(context).toContain('queries');
});

it('Gauge should render title', () => {
  render(<Gauge query={query} viewport={VIEWPORT} titleText='Gauge Title' />);

  expect(screen.getByText('Gauge Title')).toBeInTheDocument();
});
