import {
  BatchPutAssetPropertyErrorEntry,
  GetAssetPropertyValueCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import {
  getAssetPropertyValue as getAssetPropertyValueFn,
  getLastValueBeforeTimestamp,
  triggerVideoUploadRequest,
} from './sitewiseUtils';
import {
  batchPutAssetPropertyResponse,
  mockAssetId,
  mockGetAssetPropertyValueRequest,
  mockGetInterpolatedAssetPropertyValuesResponse,
  mockPropertyId,
} from '../../__mocks__/MockVideoPlayerProps';
import { createMockSiteWiseSDK } from '../../__mocks__/iotsitewiseSDK';
import {
  GetLastValueBeforeTimestampRequest,
  TriggerVideoUploadRequest,
} from '../types';

describe('SitewiseUtils for Video Player', () => {
  const batchPutAssetPropertyValue = jest.fn();
  const getAssetPropertyValue = jest.fn();
  const getInterpolatedAssetPropertyValues = jest.fn();
  const siteWiseClientMock = createMockSiteWiseSDK({
    batchPutAssetPropertyValue,
    getAssetPropertyValue,
    getInterpolatedAssetPropertyValues,
  });

  it('getAssetPropertyValue() - Check return value for String type', async () => {
    const mockGetAssetPropertyValue: GetAssetPropertyValueCommandOutput = {
      propertyValue: {
        value: {
          stringValue: '200',
        },
        timestamp: {
          timeInSeconds: 1234567890,
        },
      },
      $metadata: {},
    };
    getAssetPropertyValue.mockResolvedValue(mockGetAssetPropertyValue);
    const expectedResult = '200';
    const propertyValue = await getAssetPropertyValueFn(
      mockGetAssetPropertyValueRequest,
      siteWiseClientMock
    );
    expect(propertyValue).toEqual(expectedResult);
  });

  it('getAssetPropertyValue() - Check return value for Double type', async () => {
    const mockGetAssetPropertyValue: GetAssetPropertyValueCommandOutput = {
      propertyValue: {
        value: {
          doubleValue: 200.0,
        },
        timestamp: {
          timeInSeconds: 1234567890,
        },
      },
      $metadata: {},
    };
    getAssetPropertyValue.mockResolvedValue(mockGetAssetPropertyValue);
    const expectedResult = 200.0;
    const propertyValue = await getAssetPropertyValueFn(
      mockGetAssetPropertyValueRequest,
      siteWiseClientMock
    );
    expect(propertyValue).toEqual(expectedResult);
  });

  it('getAssetPropertyValue() - Check return value for Integer type', async () => {
    const mockGetAssetPropertyValue: GetAssetPropertyValueCommandOutput = {
      propertyValue: {
        value: {
          integerValue: 200,
        },
        timestamp: {
          timeInSeconds: 1234567890,
        },
      },
      $metadata: {},
    };
    getAssetPropertyValue.mockResolvedValue(mockGetAssetPropertyValue);
    const expectedResult = 200;
    const propertyValue = await getAssetPropertyValueFn(
      mockGetAssetPropertyValueRequest,
      siteWiseClientMock
    );
    expect(propertyValue).toEqual(expectedResult);
  });

  it('getAssetPropertyValue() - Check return value for Boolean type', async () => {
    const mockGetAssetPropertyValue: GetAssetPropertyValueCommandOutput = {
      propertyValue: {
        value: {
          booleanValue: true,
        },
        timestamp: {
          timeInSeconds: 1234567890,
        },
      },
      $metadata: {},
    };
    getAssetPropertyValue.mockResolvedValue(mockGetAssetPropertyValue);
    const expectedResult = true;
    const propertyValue = await getAssetPropertyValueFn(
      mockGetAssetPropertyValueRequest,
      siteWiseClientMock
    );
    expect(propertyValue).toEqual(expectedResult);
  });

  it('Test return value from getLastValueBeforeTimestamp', async () => {
    getInterpolatedAssetPropertyValues.mockResolvedValue(
      mockGetInterpolatedAssetPropertyValuesResponse
    );
    const expectedResult = new Date(1630005400000);
    const mockGetLastValueBeforeTimestampRequest: GetLastValueBeforeTimestampRequest =
      {
        assetId: mockAssetId,
        propertyId: mockPropertyId,
        timestamp: new Date(1630004199000),
      };
    const propertyValue = await getLastValueBeforeTimestamp(
      mockGetLastValueBeforeTimestampRequest,
      siteWiseClientMock
    );
    expect(propertyValue).toEqual(expectedResult);
  });

  it('Test triggerVideoUploadRequest with start and end time', async () => {
    const expectedErrorEntries = [
      { entryId: 'test', errors: [] },
    ] as BatchPutAssetPropertyErrorEntry[];
    batchPutAssetPropertyValue.mockResolvedValue(batchPutAssetPropertyResponse);
    const mockTriggerVideoUploadRequest: TriggerVideoUploadRequest = {
      assetId: mockAssetId,
      propertyId: mockPropertyId,
      startTimestamp: '1630005400',
      endTimestamp: '1630005444',
    };
    const result = await triggerVideoUploadRequest(
      mockTriggerVideoUploadRequest,
      siteWiseClientMock
    );
    expect(result).toEqual(expectedErrorEntries);
  });
});
