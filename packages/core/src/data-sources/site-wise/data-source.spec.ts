import flushPromises from 'flush-promises';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { createDataSource, SITEWISE_DATA_SOURCE } from './data-source';
import { MINUTE_IN_MS } from '../../common/time';
import { SiteWiseDataStreamQuery } from './types.d';
import { ASSET_PROPERTY_DOUBLE_VALUE } from '../../common/tests/mocks/assetPropertyValue';
import { createSiteWiseSDK } from '../../common/tests/util';
import { toDataStreamId } from './util/dataStreamId';

it('initializes', () => {
  expect(() => createDataSource(new IoTSiteWiseClient({ region: 'us-east' }))).not.toThrowError();
});
const noop = () => {};

describe('initiateRequest', () => {
  it('does not call SDK when query contains no assets', () => {
    const getAssetPropertyValue = jest.fn();
    const getAssetPropertyAggregates = jest.fn();
    const getAssetPropertyValueHistory = jest.fn();
    const getInterpolatedAssetPropertyValues = jest.fn();

    const mockSDK = createSiteWiseSDK({
      getAssetPropertyValue,
      getAssetPropertyValueHistory,
      getAssetPropertyAggregates,
      getInterpolatedAssetPropertyValues,
    });

    const dataSource = createDataSource(mockSDK as IoTSiteWiseClient);

    dataSource.initiateRequest(
      {
        onError: noop,
        onSuccess: noop,
        query: {
          source: SITEWISE_DATA_SOURCE,
          assets: [],
        },
        requestInfo: {
          viewport: {
            duration: MINUTE_IN_MS,
          },
          onlyFetchLatestValue: true,
        },
      },
      []
    );

    expect(getAssetPropertyAggregates).not.toBeCalled();
    expect(getAssetPropertyValue).not.toBeCalled();
    expect(getAssetPropertyValueHistory).not.toBeCalled();
    expect(getInterpolatedAssetPropertyValues).not.toBeCalled();
  });

  describe('onlyFetchLatestValue', () => {
    describe('on error', () => {
      it('calls `onError` callback', async () => {
        const ERR_MESSAGE = 'some critical error! page oncall immediately';
        const getAssetPropertyValue = jest.fn().mockRejectedValue(ERR_MESSAGE);

        const mockSDK = createSiteWiseSDK({ getAssetPropertyValue });

        const dataSource = createDataSource(mockSDK);

        const ASSET_1 = 'asset-1';
        const PROPERTY_1 = 'prop-1';

        const query: SiteWiseDataStreamQuery = {
          source: SITEWISE_DATA_SOURCE,
          assets: [{ assetId: ASSET_1, propertyIds: [PROPERTY_1] }],
        };

        const onError = jest.fn();
        const onSuccess = jest.fn();

        dataSource.initiateRequest(
          {
            onError,
            onSuccess,
            query,
            requestInfo: {
              viewport: {
                duration: MINUTE_IN_MS,
              },
              onlyFetchLatestValue: true,
            },
          },
          []
        );

        await flushPromises();

        expect(onSuccess).not.toBeCalled();
        expect(onError).toBeCalledWith(ERR_MESSAGE);
      });
    });

    it('gets latest value when provided with a duration and `onlyFetchLatestValue` is true', async () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
      const getAssetPropertyAggregates = jest.fn();
      const getAssetPropertyValueHistory = jest.fn();
      const getInterpolatedAssetPropertyValues = jest.fn();

      const mockSDK = createSiteWiseSDK({
        getAssetPropertyValue,
        getAssetPropertyValueHistory,
        getAssetPropertyAggregates,
        getInterpolatedAssetPropertyValues,
      });

      const dataSource = createDataSource(mockSDK);

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [{ assetId: 'some-asset-id', propertyIds: ['some-property-id'] }],
      };

      const onError = jest.fn();
      const onSuccess = jest.fn();

      dataSource.initiateRequest(
        {
          onError,
          onSuccess,
          query,
          requestInfo: {
            viewport: {
              duration: MINUTE_IN_MS,
            },
            onlyFetchLatestValue: true,
          },
        },
        []
      );

      await flushPromises();

      expect(getAssetPropertyAggregates).not.toBeCalled();
      expect(getAssetPropertyValueHistory).not.toBeCalled();
      expect(getInterpolatedAssetPropertyValues).not.toBeCalled();

      expect(getAssetPropertyValue).toBeCalledTimes(1);
      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].propertyIds[0],
      });

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith([
        expect.objectContaining({
          id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
          data: [{ x: 1000099, y: 10.123 }],
          resolution: 0,
          dataType: 'NUMBER',
        }),
      ]);
    });

    it('gets latest value for multiple properties', () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);

      const mockSDK = createSiteWiseSDK({ getAssetPropertyValue });

      const dataSource = createDataSource(mockSDK);

      const ASSET_ID = 'some-asset-id';
      const PROPERTY_1 = 'prop-1';
      const PROPERTY_2 = 'prop-2';

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [{ assetId: ASSET_ID, propertyIds: [PROPERTY_1, PROPERTY_2] }],
      };

      dataSource.initiateRequest(
        {
          onError: noop,
          onSuccess: noop,
          query,
          requestInfo: {
            viewport: {
              duration: MINUTE_IN_MS,
            },
            onlyFetchLatestValue: true,
          },
        },
        []
      );

      expect(getAssetPropertyValue).toBeCalledTimes(2);

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_ID,
        propertyId: PROPERTY_1,
      });

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_ID,
        propertyId: PROPERTY_2,
      });
    });

    it('gets latest value for multiple assets', () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);

      const mockSDK = createSiteWiseSDK({ getAssetPropertyValue });

      const dataSource = createDataSource(mockSDK);

      const ASSET_1 = 'asset-1';
      const ASSET_2 = 'asset-2';
      const PROPERTY_1 = 'prop-1';
      const PROPERTY_2 = 'prop-2';

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [
          { assetId: ASSET_1, propertyIds: [PROPERTY_1] },
          { assetId: ASSET_2, propertyIds: [PROPERTY_2] },
        ],
      };

      dataSource.initiateRequest(
        {
          onError: noop,
          onSuccess: noop,
          query,
          requestInfo: {
            viewport: {
              duration: MINUTE_IN_MS,
            },
            onlyFetchLatestValue: true,
          },
        },
        []
      );

      expect(getAssetPropertyValue).toBeCalledTimes(2);

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_1,
        propertyId: PROPERTY_1,
      });

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_2,
        propertyId: PROPERTY_2,
      });
    });
  });
});
