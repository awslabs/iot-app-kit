import * as React from 'react';
import { Provider } from 'react-redux';
import { act, cleanup, render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { PropertiesAlarmsSection } from './index';
import { configureDashboardStore } from '../../../../store';

import { ClientContext } from '~/components/dashboard/clientContext';

import { mockAssetDescription } from '../../../../../testing/mocks/siteWiseSDK';
import type { QueryWidget } from '../../../../customization/widgets/types';
import type { DashboardState } from '../../../../store/state';
import { DashboardIotSiteWiseClients } from '~/types';

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
  ...MOCK_KPI_WIDGET,
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
const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MockWidget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [MockWidget],
};

const renderPropertiesAndAlarmsSectionAsync = async () => {
  const describeAsset = jest.fn().mockImplementation(() => Promise.resolve(mockAssetDescription));

  const clientContext: DashboardIotSiteWiseClients = {
    iotSiteWiseClient: createMockSiteWiseSDK({ describeAsset }),
    iotEventsClient: createMockIoTEventsSDK(),
  };

  await act(async () => {
    render(
      <ClientContext.Provider value={clientContext}>
        <Provider store={configureDashboardStore(state)}>
          <PropertiesAlarmsSection {...MockWidget} />
        </Provider>
      </ClientContext.Provider>
    );
  });

  await waitFor(() => expect(describeAsset).toBeCalled());
};

describe('Properties and Alarms Section', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('renders all properties by name or id', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    mockAssetDescription.assetProperties?.forEach(({ name, id }) => {
      const label = (name && `${name} (${mockAssetDescription?.assetName || ''})`) || id || '';
      expect(screen.getByText(label));
    });
  });

  it('renders correct color picker', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    expect(screen.getByDisplayValue(MockWidget.properties.styleSettings?.['p1'].color || ''));
  });

  it('renders alarms correctly', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    mockAssetDescription.assetCompositeModels?.forEach(({ name }) => {
      expect(screen.getByText(`${name} (${mockAssetDescription.assetName})`));
    });
  });
});
