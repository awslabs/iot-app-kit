import {
  AggregateType,
  type ResourceNotFoundException,
} from '@aws-sdk/client-iotsitewise';
import { SiteWiseClientEdge } from './client';
import {
  ASSET_PROPERTY_VALUE_HISTORY,
  ASSET_PROPERTY_DOUBLE_VALUE,
  AGGREGATE_VALUES,
} from '../../../__mocks__/assetPropertyValue';
import { toId } from '../../util/dataStreamId';
import { HOUR_IN_MS, SITEWISE_PREVIEW_DATE } from '../../util/timeConstants';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

const AGGREGATE_TYPE = AggregateType.AVERAGE;

describe('SiteWiseClientEdge', () => {
  const error: Partial<ResourceNotFoundException> = {
    name: 'ResourceNotFoundException',
    message: 'assetId 1 not found',
    $metadata: {
      httpStatusCode: 404,
    },
  };

  describe('getHistoricalPropertyDataPoints', () => {
    it('calls onError on failure', async () => {
      const getAssetPropertyValueHistory = vi.fn().mockRejectedValue(error);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValueHistory })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchFromStartToEnd: true,
        },
      ];

      await client.getHistoricalPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(onError).toBeCalledWith(
        expect.objectContaining({
          error: {
            msg: error.message,
            type: error.name,
            status: error.$metadata?.httpStatusCode,
          },
        })
      );
    });

    it('makes request with fetchFromStartToEnd', async () => {
      const getAssetPropertyValueHistory = vi
        .fn()
        .mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValueHistory })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchFromStartToEnd: true,
        },
      ];

      await client.getHistoricalPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyValueHistory).toBeCalledWith(
        expect.objectContaining({ assetId, propertyId, startDate, endDate })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            data: [
              {
                x: 1000099,
                y: 10.123,
              },
              {
                x: 2000000,
                y: 12.01,
              },
            ],
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchFromStartToEnd: true,
        }),
        startDate,
        endDate
      );
    });

    it('makes request with fetchMostRecentBeforeEnd', async () => {
      const getAssetPropertyValueHistory = vi
        .fn()
        .mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValueHistory })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchMostRecentBeforeEnd: true,
        },
      ];

      await client.getHistoricalPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyValueHistory).toBeCalledWith(
        expect.objectContaining({
          assetId,
          propertyId,
          startDate: SITEWISE_PREVIEW_DATE,
          endDate,
        })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            data: [
              {
                x: 1000099,
                y: 10.123,
              },
              {
                x: 2000000,
                y: 12.01,
              },
            ],
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchMostRecentBeforeEnd: true,
        }),
        SITEWISE_PREVIEW_DATE,
        endDate
      );
    });

    it('makes request with fetchMostRecentBeforeStart', async () => {
      const getAssetPropertyValueHistory = vi
        .fn()
        .mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValueHistory })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchMostRecentBeforeStart: true,
        },
      ];

      await client.getHistoricalPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyValueHistory).toBeCalledWith(
        expect.objectContaining({
          assetId,
          propertyId,
          startDate: SITEWISE_PREVIEW_DATE,
          endDate: startDate,
        })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            data: [
              {
                x: 1000099,
                y: 10.123,
              },
              {
                x: 2000000,
                y: 12.01,
              },
            ],
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution: '0',
          fetchMostRecentBeforeStart: true,
        }),
        SITEWISE_PREVIEW_DATE,
        startDate
      );
    });
  });

  describe('getLatestPropertyDataPoint', () => {
    it('calls onError when error occurs', async () => {
      const getAssetPropertyValue = vi.fn().mockRejectedValue(error);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValue })
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: new Date(),
          end: new Date(),
          resolution: '0',
          fetchMostRecentBeforeEnd: true,
        },
      ];

      await client.getLatestPropertyDataPoint({
        onSuccess,
        onError,
        requestInformations,
      });

      expect(onSuccess).not.toBeCalled();

      expect(onError).toBeCalledWith(
        expect.objectContaining({
          error: {
            msg: error.message,
            type: error.name,
            status: error.$metadata?.httpStatusCode,
          },
        })
      );
    });

    it('makes request with fetchFromStartToEnd', async () => {
      const getAssetPropertyValue = vi
        .fn()
        .mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const start = new Date(1000099);
      const end = new Date();

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start,
          end,
          resolution: '0',
          fetchMostRecentBeforeEnd: true,
        },
      ];

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyValue })
      );

      await client.getLatestPropertyDataPoint({
        onSuccess,
        onError,
        requestInformations,
      });
      expect(getAssetPropertyValue).toBeCalledWith({ assetId, propertyId });

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            data: [
              {
                y: ASSET_PROPERTY_DOUBLE_VALUE.propertyValue?.value
                  ?.doubleValue,
                x: 1000099,
              },
            ],
            resolution: 0,
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start,
          end,
          resolution: '0',
          fetchMostRecentBeforeEnd: true,
        }),
        start,
        end
      );
    });
  });

  describe('getAggregatedPropertyDataPoints', () => {
    it('calls onError on failure', async () => {
      const getAssetPropertyAggregates = vi.fn().mockRejectedValue(error);
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyAggregates })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);
      const resolution = '1h';

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchFromStartToEnd: true,
          aggregationType: AGGREGATE_TYPE,
        },
      ];

      await client.getAggregatedPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(onSuccess).not.toBeCalled();

      expect(onError).toBeCalledWith(
        expect.objectContaining({
          error: {
            msg: error.message,
            type: error.name,
            status: error.$metadata?.httpStatusCode,
          },
        })
      );
    });

    it('makes request with fetchFromStartToEnd', async () => {
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();
      const getAssetPropertyAggregates = vi
        .fn()
        .mockResolvedValue(AGGREGATE_VALUES);

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyAggregates })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);
      const resolution = '1h';

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchFromStartToEnd: true,
          aggregationType: AGGREGATE_TYPE,
        },
      ];

      await client.getAggregatedPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyAggregates).toBeCalledWith(
        expect.objectContaining({
          assetId,
          propertyId,
          startDate,
          endDate,
          resolution,
        })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            aggregationType: AggregateType.AVERAGE,
            data: [
              {
                x: 946602000000,
                y: 5,
              },
              {
                x: 946605600000,
                y: 7,
              },
              {
                x: 946609200000,
                y: 10,
              },
            ],
            resolution: HOUR_IN_MS,
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchFromStartToEnd: true,
        }),
        startDate,
        endDate
      );
    });

    it('makes request with fetchMostRecentBeforeEnd', async () => {
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();
      const getAssetPropertyAggregates = vi
        .fn()
        .mockResolvedValue(AGGREGATE_VALUES);

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyAggregates })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);
      const resolution = '1h';

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeEnd: true,
          aggregationType: AGGREGATE_TYPE,
        },
      ];

      await client.getAggregatedPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyAggregates).toBeCalledWith(
        expect.objectContaining({
          assetId,
          propertyId,
          startDate: SITEWISE_PREVIEW_DATE,
          endDate,
          resolution,
        })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            aggregationType: AggregateType.AVERAGE,
            data: [
              {
                x: 946602000000,
                y: 5,
              },
              {
                x: 946605600000,
                y: 7,
              },
              {
                x: 946609200000,
                y: 10,
              },
            ],
            resolution: HOUR_IN_MS,
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeEnd: true,
        }),
        SITEWISE_PREVIEW_DATE,
        endDate
      );
    });

    it('makes request with fetchMostRecentBeforeStart', async () => {
      const assetId = 'some-asset-id';
      const propertyId = 'some-property-id';

      const onSuccess = vi.fn();
      const onError = vi.fn();
      const getAssetPropertyAggregates = vi
        .fn()
        .mockResolvedValue(AGGREGATE_VALUES);

      const client = new SiteWiseClientEdge(
        createMockSiteWiseSDK({ getAssetPropertyAggregates })
      );

      const startDate = new Date(2000, 0, 0);
      const endDate = new Date(2001, 0, 0);
      const resolution = '1h';

      const requestInformations = [
        {
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeStart: true,
          aggregationType: AGGREGATE_TYPE,
        },
      ];

      await client.getAggregatedPropertyDataPoints({
        requestInformations,
        onSuccess,
        onError,
      });

      expect(getAssetPropertyAggregates).toBeCalledWith(
        expect.objectContaining({
          assetId,
          propertyId,
          startDate: SITEWISE_PREVIEW_DATE,
          endDate: startDate,
          resolution,
        })
      );

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledWith(
        [
          expect.objectContaining({
            id: toId({ assetId, propertyId }),
            aggregationType: AggregateType.AVERAGE,
            data: [
              {
                x: 946602000000,
                y: 5,
              },
              {
                x: 946605600000,
                y: 7,
              },
              {
                x: 946609200000,
                y: 10,
              },
            ],
            resolution: HOUR_IN_MS,
          }),
        ],
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeStart: true,
        }),
        SITEWISE_PREVIEW_DATE,
        startDate
      );
    });
  });
});
