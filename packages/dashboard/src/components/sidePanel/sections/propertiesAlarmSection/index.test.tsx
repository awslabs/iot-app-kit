import * as React from 'react';
import { Provider } from 'react-redux';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { PropertyComponent } from './propertyComponent';
import { cleanup, render, screen } from '@testing-library/react';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import PropertiesAlarmsSection from './index';
import { configureDashboardStore } from '../../../../store';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { QueryWidget } from '../../../../customization/widgets/types';
import type { DashboardState } from '../../../../store/state';

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
jest.mock('../../../../hooks/useAssetDescriptionMapAsync', () => {
  return jest.fn(() => ({
    useAssetDescriptionMapAsync: () => assetDescription,
  }));
});

const mockOnDeleteAssetQuery = jest.fn();
const MockAssetQuery: SiteWiseAssetQuery['assets'][number] = {
  assetId: 'mock-id',
  properties: [
    { propertyId: 'property-1', refId: 'p1' },
    { propertyId: 'property-2', refId: 'p2' },
  ],
};
const mockOnUpdatePropertyColor = jest.fn();

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

describe.skip('PropertyComponent', () => {
  const TestPropertyComponent = () => {
    return (
      <Provider store={configureDashboardStore(state)}>
        {MockAssetQuery.properties.map(({ propertyId, refId }) => (
          <PropertyComponent
            assetDescription={assetDescription}
            styleSettings={styleSettings}
            key={propertyId}
            propertyId={propertyId}
            refId={refId || propertyId}
            onDeleteAssetQuery={mockOnDeleteAssetQuery}
            onUpdatePropertyColor={mockOnUpdatePropertyColor}
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
    expect(screen.getByDisplayValue(MockWidget.properties.styleSettings?.['p1'].color || ''));
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

describe.skip('propertiesSectionComponent', () => {
  const TestSection = () => (
    <Provider store={configureDashboardStore(state)}>
      <PropertiesAlarmsSection {...MockWidget} />
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
