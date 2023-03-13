import * as React from 'react';
import { Provider } from 'react-redux';
import { act, cleanup, render, screen } from '@testing-library/react';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import PropertiesAlarmsSection from './index';
import { configureDashboardStore } from '../../../../store';

import { ClientContext } from '~/components/dashboard/clientContext';

import { mockAssetDescription, mockSiteWiseSDK } from '../../../../../testing/mocks/siteWiseSDK';
import { waitFor } from '@testing-library/dom';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { QueryWidget } from '../../../../customization/widgets/types';
import type { DashboardState } from '../../../../store/state';

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
  const client = mockSiteWiseSDK({ describeAsset });

  await act(async () => {
    render(
      <ClientContext.Provider value={client}>
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

  it('renders property alias if property has one', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    mockAssetDescription.assetProperties
      ?.filter((p) => p.alias)
      .forEach(({ alias }) => {
        expect(screen.getByText(`Alias: ${alias}`));
      });
  });

  it('renders property data types', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    mockAssetDescription.assetProperties?.forEach(({ dataType }) => {
      if (dataType) expect(screen.getByText(`Data Type: ${dataType}`));
    });
  });

  it('renders alarms correctly', async () => {
    await renderPropertiesAndAlarmsSectionAsync();
    mockAssetDescription.assetCompositeModels?.forEach(({ name }) => {
      expect(screen.getByText(`${name} (${mockAssetDescription.assetName})`));
    });
  });
});
