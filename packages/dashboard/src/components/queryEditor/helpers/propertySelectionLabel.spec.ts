import { type DashboardWidget } from '~/types';
import { propertySelectionLabel } from './propertySelectionLabel';

const createMockWidget = (widgetType: string): DashboardWidget => {
  return {
    type: widgetType,
    id: 'test-id',
    x: 0,
    y: 0,
    z: 0,
    height: 20,
    width: 20,
    properties: {},
  };
};

const mockAssetProperty = {
  propertyId: 'test-property',
  name: 'Test Property',
  assetId: '12345',
  dataType: 'INTEGER',
};

const mockInvalidAssetProperty = {
  propertyId: 'test-property2',
  name: 'Test Property 2',
  assetId: '123456',
  dataType: 'STRING',
};

describe('Selection Labels for asset (model) properties', () => {
  it('Unselected Property', () => {
    expect(
      propertySelectionLabel([], mockAssetProperty, [
        createMockWidget('xy-plot'),
      ])
    ).toBe('Select modeled data stream Test Property');
  });
  it('Selected Property', () => {
    expect(
      propertySelectionLabel([mockAssetProperty], mockAssetProperty, [
        createMockWidget('xy-plot'),
      ])
    ).toBe('Deselect modeled data stream Test Property');
  });
  it('Invalid Property', () => {
    expect(
      propertySelectionLabel([], mockInvalidAssetProperty, [
        createMockWidget('xy-plot'),
      ])
    ).toBe('STRING data not supported for the selected widget');
  });
});
