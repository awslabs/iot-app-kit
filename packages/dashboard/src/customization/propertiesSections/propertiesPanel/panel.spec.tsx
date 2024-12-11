import { QueryClient } from '@tanstack/react-query';
import {
  IoTSiteWise,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  type RenderResult,
  act,
  waitFor,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import { Provider } from 'react-redux';
import { PropertiesPanel } from './panel';
import { configureDashboardStore } from '../../../store/index-old';
import { type DashboardState } from '../../../store/state-old';
import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import { mockAssetDescription } from '../../../../testing/mocks/siteWiseSDK';
import { type SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { type QueryWidget } from '../../../customization/widgets/types';
import { type DashboardIotSiteWiseClients } from '../../../types';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import { ClientContext } from '../../../components/dashboard/clientContext';

vi.mock('../../data/query-client', () => ({
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }),
}));

const MockAssetQuery: SiteWiseAssetQuery['assets'][number] = {
  assetId: 'mock-id',
  properties: [
    { propertyId: 'property-1', refId: 'p1' },
    { propertyId: 'property-2', refId: 'p2' },
    { propertyId: 'e70495ff-c016-4175-9012-62c37857e0d1' },
  ],
};

const styleSettings = {
  p1: {
    color: '#00ff00',
  },
  p2: {
    color: '#0000ff',
  },
};
const MockWidget: QueryWidget = {
  ...MOCK_LINE_CHART_WIDGET,
  properties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        assets: [MockAssetQuery],
      },
    },
    styleSettings,
  },
};

type SetupStoreOptions = {
  widgets?: DashboardState['dashboardConfiguration']['widgets'];
  selectedWidgets?: DashboardState['selectedWidgets'];
};

const setupStore = ({ widgets, selectedWidgets }: SetupStoreOptions) =>
  configureDashboardStore({
    dashboardConfiguration: {
      widgets,
    },
    selectedWidgets,
  });

const renderTestComponentAsync = async (
  options?: SetupStoreOptions
): Promise<RenderResult> => {
  const optionsWithDefault = {
    widgets: [MockWidget],
    selectedWidgets: [MockWidget],
    ...options,
  };

  const widgets = optionsWithDefault.widgets;
  const selectedWidgets = optionsWithDefault.selectedWidgets;

  const describeAsset = vi
    .fn()
    .mockImplementation(() => Promise.resolve(mockAssetDescription));

  const clientContext: DashboardIotSiteWiseClients = {
    iotSiteWiseClient: createMockSiteWiseSDK({
      describeAsset,
    }) as unknown as IoTSiteWiseClient,
    iotEventsClient: createMockIoTEventsSDK(),
    iotTwinMakerClient: { send: vi.fn() } as unknown as IoTTwinMakerClient,
    iotSiteWise: new IoTSiteWise(),
  };

  const element = await waitFor(async () =>
    render(
      <ClientContext.Provider value={clientContext}>
        <Provider store={setupStore({ widgets, selectedWidgets })}>
          <PropertiesPanel />
        </Provider>
      </ClientContext.Provider>
    )
  );

  if (element === undefined) throw new Error('Something went wrong!');

  return element;
};

describe(`${PropertiesPanel.name}`, () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(cleanup);

  it('should render tabs', async () => {
    await renderTestComponentAsync();

    expect(screen.getByText('Style')).toBeVisible();
    expect(screen.getByText('Properties')).toBeVisible();
    expect(screen.getByText('Thresholds')).toBeVisible();
  });

  it('should render an empty selection when nothing is selected', async () => {
    await renderTestComponentAsync({ selectedWidgets: [] });

    expect(screen.getByText('Select a widget to configure.')).toBeVisible();
  });

  it('should render the style section', async () => {
    await renderTestComponentAsync();

    expect(screen.getByText('Style')).toBeVisible();
    expect(screen.getByText('Axis')).toBeVisible();
    expect(screen.getByText('Format data')).toBeVisible();
  });
  it('should render the style section when switched between widgets', async () => {
    await renderTestComponentAsync();

    expect(screen.getByText('Style')).toBeVisible();
    expect(screen.getByText('Axis')).toBeVisible();
    expect(screen.getByText('Format data')).toBeVisible();

    const thresholdsTab = screen.getByTestId('thresholds');
    expect(thresholdsTab).toBeVisible();

    fireEvent.click(thresholdsTab);
    expect(screen.getByText('Add a threshold')).toBeVisible();

    const options = {
      widgets: [MOCK_KPI_WIDGET],
      selectedWidgets: [MOCK_KPI_WIDGET],
    };

    await renderTestComponentAsync(options);
    expect(screen.getByText('Format data')).toBeVisible();
  });

  it('should render an empty thresholds section', async () => {
    const element = await renderTestComponentAsync();
    const trigger = createWrapper(element.baseElement);

    expect(screen.getByText('Thresholds')).toBeVisible();

    act(() => {
      trigger.findTabs()?.findTabLinkByIndex(3)?.click();
    });

    expect(screen.getByText('Add a threshold')).toBeVisible();
  });
});
