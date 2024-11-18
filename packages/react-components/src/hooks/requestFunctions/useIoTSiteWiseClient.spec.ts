import { renderHook } from '@testing-library/react';
import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
  DescribeAsset,
  DescribeAssetModel,
  ExecuteQuery,
  GetAssetPropertyValue,
  GetAssetPropertyValueHistory,
  ListAssetModelProperties,
  ListAssetModels,
  ListAssetProperties,
  ListAssets,
  ListAssociatedAssets,
  ListTimeSeries,
} from '@iot-app-kit/core';
import { useIoTSiteWiseClient } from './useIoTSiteWiseClient';

describe('useIoTSiteWiseClient tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('useIoTSiteWiseClient accepts a custom SiteWise client', async () => {
    const getAssetPropertyValueMock = jest.fn();
    const customSiteWiseClient = {
      getAssetPropertyValue: (_, __) => {
        getAssetPropertyValueMock();
      },
    } as IoTSiteWise;
    const {
      result: { current: iotSiteWiseClient },
    } = renderHook(() =>
      useIoTSiteWiseClient({ iotSiteWiseClient: customSiteWiseClient })
    );

    await iotSiteWiseClient.getAssetPropertyValue({
      assetId: 'assetId',
      propertyId: 'propertyId',
    });
    expect(getAssetPropertyValueMock).toBeCalled();
  });

  it('useIoTSiteWiseClient accepts an IoTSiteWise client', async () => {
    const getAssetPropertyValueMock = jest.fn();
    const siteWiseClient = {
      ...new IoTSiteWise({
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
          sessionToken: '',
        },
        region: 'us-east-1',
      }),
      getAssetPropertyValue: getAssetPropertyValueMock,
    } as unknown as IoTSiteWise;

    const {
      result: { current: iotSiteWiseClient },
    } = renderHook(() =>
      useIoTSiteWiseClient({ iotSiteWiseClient: siteWiseClient })
    );

    await iotSiteWiseClient.getAssetPropertyValue({
      assetId: 'assetId',
      propertyId: 'propertyId',
    });
    expect(getAssetPropertyValueMock).toBeCalled();
  });

  it('useIoTSiteWiseClient accepts an IoTSiteWiseClient client', async () => {
    const siteWiseClient = new IoTSiteWiseClient({});

    const {
      result: { current: iotSiteWiseClient },
    } = renderHook(() =>
      useIoTSiteWiseClient({ iotSiteWiseClient: siteWiseClient })
    );

    expect(
      iotSiteWiseClient.getAssetPropertyValue as GetAssetPropertyValue
    ).toBeDefined();
    expect(
      iotSiteWiseClient.batchGetAssetPropertyValue as BatchGetAssetPropertyValue
    ).toBeDefined();
    expect(
      iotSiteWiseClient.getAssetPropertyValueHistory as GetAssetPropertyValueHistory
    ).toBeDefined();
    expect(
      iotSiteWiseClient.batchGetAssetPropertyValueHistory as BatchGetAssetPropertyValueHistory
    ).toBeDefined();
    expect(iotSiteWiseClient.executeQuery as ExecuteQuery).toBeDefined();
    expect(iotSiteWiseClient.listAssetModels as ListAssetModels).toBeDefined();
    expect(
      iotSiteWiseClient.listAssetModelProperties as ListAssetModelProperties
    ).toBeDefined();
    expect(iotSiteWiseClient.listAssets as ListAssets).toBeDefined();
    expect(
      iotSiteWiseClient.listAssociatedAssets as ListAssociatedAssets
    ).toBeDefined();
    expect(iotSiteWiseClient.listTimeSeries as ListTimeSeries).toBeDefined();
    expect(
      iotSiteWiseClient.listAssetProperties as ListAssetProperties
    ).toBeDefined();
    expect(iotSiteWiseClient.describeAsset as DescribeAsset).toBeDefined();
    expect(
      iotSiteWiseClient.describeAssetModel as DescribeAssetModel
    ).toBeDefined();
  });

  it('useIoTSiteWiseClient handles an undefined SiteWise client', async () => {
    const { result } = renderHook(() =>
      useIoTSiteWiseClient({ iotSiteWiseClient: undefined })
    );

    expect(result.current).toStrictEqual({});
  });
});
