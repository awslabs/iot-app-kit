import * as React from 'react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../../store';
import { PropertyComponent } from './propertyComponent';
import { AssetQuery } from '@iot-app-kit/core';
import { DashboardState } from '../../../../store/state';
import { DescribeAssetResponse, PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { cleanup, render, screen } from '@testing-library/react';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { AppKitWidget } from '../../../../types';
import PropertiesAlarmsSection from './index';
import { DefaultDashboardMessages } from '../../../../messages';

const mockOnDeleteAssetQuery = jest.fn();
const MockAssetQuery: AssetQuery = {
  assetId: 'mock-id',
  properties: [
    { propertyId: 'property-1', refId: 'p1' },
    { propertyId: 'property-2', refId: 'p2' },
  ],
};
const assetDescription: DescribeAssetResponse = {
  assetArn: undefined,
  assetCreationDate: undefined,
  assetHierarchies: undefined,
  assetLastUpdateDate: undefined,
  assetModelId: undefined,
  assetName: 'Mock Asset',
  assetStatus: undefined,
  assetId: 'mock-id',
  assetProperties: [
    { name: 'property one', id: 'property-1', dataType: PropertyDataType.DOUBLE, alias: 'P1' },
    { name: 'property two', id: 'property-2', dataType: PropertyDataType.STRING },
  ],
};
const MockWidget: AppKitWidget = {
  ...MOCK_KPI_WIDGET,
  assets: [MockAssetQuery],
  styleSettings: {
    p1: {
      color: '#00ff00',
    },
    p2: {
      color: '#0000ff',
    },
  },
};
const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MockWidget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [MockWidget],
  assetsDescriptionMap: {
    'mock-id': assetDescription,
  },
};

describe('PropertyComponent', () => {
  const TestPropertyComponent = () => {
    return (
      <Provider store={configureDashboardStore(state)}>
        {MockAssetQuery.properties.map(({ propertyId, refId }) => (
          <PropertyComponent
            messageOverrides={DefaultDashboardMessages}
            key={propertyId}
            assetId={MockAssetQuery.assetId}
            propertyId={propertyId}
            refId={refId || propertyId}
            onDeleteAssetQuery={mockOnDeleteAssetQuery}
          />
        ))}
      </Provider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('renders all properties by name or id', async () => {
    render(<TestPropertyComponent />);
    assetDescription.assetProperties?.forEach(({ name, id }) => {
      const label = (name && `${name} (${assetDescription?.assetName || ''})`) || id || '';
      expect(screen.getByText(label));
    });
  });

  it('renders correct color picker', async () => {
    render(<TestPropertyComponent />);
    expect(
      screen.getByDisplayValue(
        (state.dashboardConfiguration?.widgets[0] as AppKitWidget).styleSettings?.['p1'].color || ''
      )
    );
  });

  it('renders property alias if property has one', () => {
    render(<TestPropertyComponent />);
    assetDescription.assetProperties
      ?.filter((p) => p.alias)
      .forEach(({ alias }) => {
        expect(screen.getByText(`Alias: ${alias}`));
      });
  });

  it('renders property data types', () => {
    render(<TestPropertyComponent />);
    assetDescription.assetProperties?.forEach(({ dataType }) => {
      if (dataType) expect(screen.getByText(`Data Type: ${dataType}`));
    });
  });
});

describe('propertiesSectionComponent', () => {
  const TestSection = () => (
    <Provider store={configureDashboardStore(state)}>
      <PropertiesAlarmsSection messageOverrides={DefaultDashboardMessages} />
    </Provider>
  );

  it('renders correct amount of properties', () => {
    render(<TestSection />);
    assetDescription.assetProperties?.forEach(({ name, id }) => {
      const label = (name && `${name} (${assetDescription?.assetName || ''})`) || id || '';
      expect(screen.getByText(label));
    });
  });
});
