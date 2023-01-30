import { toDataStreamId, toSiteWiseAssetProperty } from './dataStreamId';

describe('toDataStreamId', () => {
  it('converts property and asset id to a data stream id', () => {
    expect(toDataStreamId({ assetId: 'asset-id', propertyId: 'property-id' })).toBe('asset-id---property-id');
  });
});

describe('toSiteWiseAssetProperty', () => {
  it('converts a data stream id to a asset and property id', () => {
    expect(toSiteWiseAssetProperty('asset-id---property-id')).toEqual({
      assetId: 'asset-id',
      propertyId: 'property-id',
    });
  });

  it('conversion to alias and property id throws error when given an invalid id', () => {
    expect(() => toSiteWiseAssetProperty('some-bad-id!')).toThrowError('---');
  });
});
