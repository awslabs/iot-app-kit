import {
  IoTSiteWise,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PropertiesPanel } from './panel';
import { configureDashboardStore } from '~/store';
import { type DashboardState } from '~/store/state';
import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_TEXT_WIDGET,
} from '../../../../testing/mocks';
import { mockAssetDescription } from '../../../../testing/mocks/siteWiseSDK';
import { type DashboardIotSiteWiseClients } from '~/types';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import { ClientContext } from '~/components/dashboard/clientContext';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

type SetupStoreOptions = {
  widgets?: DashboardState['dashboardConfiguration']['widgets'];
  selectedWidgets?: DashboardState['selectedWidgetIds'];
};

const setupStore = ({ widgets, selectedWidgets }: SetupStoreOptions) =>
  configureDashboardStore({
    dashboardConfiguration: {
      widgets,
    },
    selectedWidgetIds: selectedWidgets,
  });

const renderTestComponent = (options?: SetupStoreOptions) => {
  const optionsWithDefault = {
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_TEXT_WIDGET],
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

  const element = render(
    <ClientContext.Provider value={clientContext}>
      <Provider store={setupStore({ widgets, selectedWidgets })}>
        <PropertiesPanel />
      </Provider>
    </ClientContext.Provider>
  );

  if (element === undefined) throw new Error('Something went wrong!');

  return element;
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('empty state when no component selected', () => {
  renderTestComponent({ selectedWidgets: [] });

  expect(screen.getByText('Select a widget to configure.')).toBeVisible();
});

test('tabs rendered when component selected', () => {
  renderTestComponent({ selectedWidgets: [MOCK_KPI_WIDGET.id] });

  // style tab is selected initially
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeVisible();
});

test('tab selection', async () => {
  renderTestComponent({ selectedWidgets: [MOCK_KPI_WIDGET.id] });

  // style tab is selected
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeVisible();

  // select properties tab
  await user.click(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  );

  // properties tab is selected
  expect(
    screen.getByRole('tab', { name: 'Style', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeVisible();

  // select thresholds tab
  await user.click(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  );

  // thresholds tab is selected
  expect(
    screen.getByRole('tab', { name: 'Style', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: true })
  ).toBeVisible();

  // select style tab
  await user.click(screen.getByRole('tab', { name: 'Style', selected: false }));

  // style tab is selected again
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeVisible();
});

test('should render the style section when switched between widgets', async () => {
  const { unmount } = renderTestComponent({
    selectedWidgets: [MOCK_LINE_CHART_WIDGET.id],
  });

  // style tab is selected
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeVisible();

  // select thresholds tab
  await user.click(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  );

  // thresholds tab is selected
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: true })
  ).toBeVisible();

  // change selected widget
  // FIXME: This is a hack to prevent rendering the component multiple times
  unmount();
  renderTestComponent({
    selectedWidgets: [MOCK_KPI_WIDGET.id],
  });

  // style tab is selected again
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeVisible();
});

// FIXME: Remove widget specific test
test('text widget', async () => {
  renderTestComponent({
    selectedWidgets: [MOCK_TEXT_WIDGET.id],
  });

  // text widget only supports styles tab
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeEnabled();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeDisabled();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeDisabled();

  // try to select properties tab
  await user.click(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  );

  // nothing happened
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeEnabled();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeDisabled();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeDisabled();

  // try to select thresholds tab
  await user.click(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  );

  // nothing happened
  expect(
    screen.getByRole('tab', { name: 'Style', selected: true })
  ).toBeEnabled();
  expect(
    screen.getByRole('tab', { name: 'Properties', selected: false })
  ).toBeDisabled();
  expect(
    screen.getByRole('tab', { name: 'Thresholds', selected: false })
  ).toBeDisabled();
});
