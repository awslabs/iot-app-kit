import type { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { type DataStream } from '@iot-app-kit/core';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { render, screen } from '@testing-library/react';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../../common/assistantProps';
import { Chart } from '../index';
import { type ChartLegend } from '../types';

vi.mock('zustand');

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
};
vi.mock('echarts', () => ({
  use: vi.fn(),
  init: vi.fn(),
  getInstanceByDom: vi.fn(),
  registerTheme: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  graphic: vi.fn(),
  ComponentView: vi.fn(),
  ComponentModel: vi.fn(),
}));

afterAll(() => {
  vi.clearAllMocks();
});

export const mockQuery = mockTimeSeriesDataQuery([
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
  conversationId: 'conversationId',
  componentId: 'componentId',
  target: 'widget',
  client,
} satisfies AssistantProperty;

describe('Chart Component Testing', () => {
  it('Chart renders', () => {
    const element = render(
      <Chart
        queries={[mockQuery]}
        onChartOptionsChange={vi.fn()}
        viewport={VIEWPORT}
        size={{ width: 500, height: 500 }}
      />
    );
    expect(element).not.toBeNull();
  });

  it('Chart renders with assistant action panel', () => {
    expect(() => {
      render(
        <Chart
          queries={[mockQuery]}
          onChartOptionsChange={vi.fn()}
          viewport={VIEWPORT}
          size={{ width: 500, height: 500 }}
          assistant={assistant}
        />
      );
    }).not.toThrowError();
  });

  it('Chart should render title', () => {
    render(
      <Chart
        queries={[mockQuery]}
        onChartOptionsChange={vi.fn()}
        viewport={VIEWPORT}
        size={{ width: 500, height: 500 }}
        id='componentId'
        titleText='Chart Title'
      />
    );

    expect(screen.getByText('Chart Title')).toBeInTheDocument();
  });
});

describe('Chart slider testing', () => {
  it('should show resize slider when show legend feature is on', () => {
    const options = {
      queries: [],
      aggregationType: 'average',
      axis: { showY: true, showX: true, yMin: undefined, yMax: undefined },
      legend: {
        visible: true,
        position: 'left' as keyof ChartLegend['position'],
        width: '30%',
        height: '30%',
        visibleContent: {
          unit: true,
          asset: true,
        },
      },
      onChartOptionsChange: vi.fn(),
      gestures: false,
      significantDigits: 4,
      styleSettings: {},
      thresholds: undefined,
    };

    const { container } = render(<Chart {...options} />);
    expect(container.getElementsByClassName('chart-timestamp').length).toBe(1);
    expect(
      container.getElementsByClassName('react-resizable-handle-se').length
    ).toBe(1);
  });

  it('should show resize slider when show legend feature is off', () => {
    const options = {
      queries: [],
      aggregationType: 'average',
      axis: { showY: true, showX: true, yMin: undefined, yMax: undefined },
      legend: {
        visible: false,
        position: 'bottom' as keyof ChartLegend['position'],
        width: '30%',
        height: '30%',
        visibleContent: {
          unit: true,
          asset: true,
        },
      },
      onChartOptionsChange: vi.fn(),
      gestures: false,
      significantDigits: 4,
      styleSettings: {},
      thresholds: undefined,
    };

    const { container } = render(<Chart {...options} />);
    expect(container.getElementsByClassName('chart-timestamp').length).toBe(1);
    expect(
      container.getElementsByClassName('react-resizable-handle-se').length
    ).toBe(0);
  });
});
