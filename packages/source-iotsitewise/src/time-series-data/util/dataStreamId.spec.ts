import { toId, toSiteWiseAssetProperty } from './dataStreamId';

describe('toDataStreamId', () => {
  it('converts property and asset id to a data stream id', () => {
    expect(toId({ assetId: 'asset-id', propertyId: 'property-id' })).toBe('asset-id---property-id');
  });

  it('converts propertyAlias to a data stream id', () => {
    const propertyAlias = 'some/property/alias';
    expect(toId({ propertyAlias })).toBe(propertyAlias);
  });
});

describe('toSiteWiseAssetProperty', () => {
  it('converts a data stream id to a asset and property id', () => {
    expect(toSiteWiseAssetProperty('asset-id---property-id')).toEqual({
      assetId: 'asset-id',
      propertyId: 'property-id',
    });
  });

  it('converts a data stream id to a property alias', () => {
    expect(toSiteWiseAssetProperty('some/alias')).toEqual({ propertyAlias: 'some/alias' });
  });
});
