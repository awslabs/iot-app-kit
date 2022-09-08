import {
  BatchPutAssetPropertyErrorEntry,
  BatchPutAssetPropertyValueCommand,
  GetAssetPropertyValueCommand,
  GetAssetPropertyValueCommandOutput,
  GetInterpolatedAssetPropertyValuesCommand,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { mockClient } from 'aws-sdk-client-mock';
import { getAssetPropertyValue, getLastValueBeforeTimestamp, triggerVideoUploadRequest } from './sitewiseUtils';
import {
  batchPutAssetPropertyResponse,
  mockAssetId,
  mockAWSCredentials,
  mockGetAssetPropertyValueRequest,
  mockGetInterpolatedAssetPropertyValuesResponse,
  mockPropertyId,
} from '../../__mocks__/MockVideoPlayerProps';
import { GetLastValueBeforeTimestampRequest, TriggerVideoUploadRequest } from '../types';

describe('SitewiseUtils for Video Player', () => {
  const sitewiseClient = new IoTSiteWiseClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const siteWiseClientMock = mockClient(sitewiseClient);

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
    siteWiseClientMock.on(GetAssetPropertyValueCommand).resolves(mockGetAssetPropertyValue);
    const expectedResult = '200';
    const propertyValue = await getAssetPropertyValue(mockGetAssetPropertyValueRequest, sitewiseClient);
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
    siteWiseClientMock.on(GetAssetPropertyValueCommand).resolves(mockGetAssetPropertyValue);
    const expectedResult = 200.0;
    const propertyValue = await getAssetPropertyValue(mockGetAssetPropertyValueRequest, sitewiseClient);
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
    siteWiseClientMock.on(GetAssetPropertyValueCommand).resolves(mockGetAssetPropertyValue);
    const expectedResult = 200;
    const propertyValue = await getAssetPropertyValue(mockGetAssetPropertyValueRequest, sitewiseClient);
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
    siteWiseClientMock.on(GetAssetPropertyValueCommand).resolves(mockGetAssetPropertyValue);
    const expectedResult = true;
    const propertyValue = await getAssetPropertyValue(mockGetAssetPropertyValueRequest, sitewiseClient);
    expect(propertyValue).toEqual(expectedResult);
  });

  it('Test return value from getLastValueBeforeTimestamp', async () => {
    siteWiseClientMock
      .on(GetInterpolatedAssetPropertyValuesCommand)
      .resolves(mockGetInterpolatedAssetPropertyValuesResponse);
    const expectedResult = new Date(1630005400000);
    const mockGetLastValueBeforeTimestampRequest: GetLastValueBeforeTimestampRequest = {
      assetId: mockAssetId,
      propertyId: mockPropertyId,
      timestamp: new Date(1630004199000),
    };
    const propertyValue = await getLastValueBeforeTimestamp(mockGetLastValueBeforeTimestampRequest, sitewiseClient);
    expect(propertyValue).toEqual(expectedResult);
  });

  it('Test triggerVideoUploadRequest with start and end time', async () => {
    const expectedErrorEntries = [{ entryId: 'test', errors: [] }] as BatchPutAssetPropertyErrorEntry[];
    siteWiseClientMock.on(BatchPutAssetPropertyValueCommand).resolves(batchPutAssetPropertyResponse);
    const mockTriggerVideoUploadRequest: TriggerVideoUploadRequest = {
      assetId: mockAssetId,
      propertyId: mockPropertyId,
      startTimestamp: '1630005400',
      endTimestamp: '1630005444',
    };
    const result = await triggerVideoUploadRequest(mockTriggerVideoUploadRequest, sitewiseClient);
    expect(result).toEqual(expectedErrorEntries);
  });
});
