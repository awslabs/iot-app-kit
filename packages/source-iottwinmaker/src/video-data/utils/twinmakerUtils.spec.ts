import {
  GetPropertyValueHistoryCommand,
  GetPropertyValueHistoryCommandOutput,
  IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';
import { mockClient } from 'aws-sdk-client-mock';
import { Primitive } from '../../common/types';
import { createPropertyIndentifierKey, generateEntityRefKey, getSinglePropertyValueHistory } from './twinmakerUtils';
import {
  mockAWSCredentials,
  mockComponentName,
  mockEntityId,
  mockEntityPropertyReference,
  mockEntityPropertyReferenceWithExtId,
  mockGetPropertyValueHistoryRequest,
  mockPropertyId,
} from '../../__mocks__/MockVideoPlayerProps';

describe('TwinMakerUtils for Video Player', () => {
  const twinMakerClient = new IoTTwinMakerClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const twinMakerClientMock = mockClient(twinMakerClient);

  it('getSinglePropertyValueHistory() - Check return value for String type', async () => {
    const mockGetPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput = {
      propertyValues: [
        {
          entityPropertyReference: {
            componentName: mockComponentName,
            entityId: mockEntityId,
            propertyName: mockPropertyId,
          },
          values: [
            {
              value: {
                stringValue: '1630005400',
              },
              time: new Date(1658260800).toISOString(),
            },
            {
              value: {
                stringValue: '1630005800',
              },
              time: new Date(1658260810).toISOString(),
            },
          ],
        },
      ],
      $metadata: {},
    };
    twinMakerClientMock.on(GetPropertyValueHistoryCommand).resolves(mockGetPropertyValueHistoryResponse);
    const mockDataId = createPropertyIndentifierKey(mockEntityId, mockComponentName, mockPropertyId);
    const expectedResult: {
      [id: string]: {
        x: number;
        y: Primitive;
      }[];
    } = {
      [mockDataId]: [
        { x: 1658260800, y: '1630005400' },
        { x: 1658260810, y: '1630005800' },
      ],
    };
    const propertyValueHistory = await getSinglePropertyValueHistory(
      mockGetPropertyValueHistoryRequest,
      twinMakerClient
    );
    setTimeout(() => {
      expect(propertyValueHistory).toEqual(expectedResult);
    }, 1);
  });

  it('getSinglePropertyValueHistory() - Check return value for Double type', async () => {
    const mockGetPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput = {
      propertyValues: [
        {
          entityPropertyReference: {
            componentName: mockComponentName,
            entityId: mockEntityId,
            propertyName: mockPropertyId,
          },
          values: [
            {
              value: {
                doubleValue: 1630005400.0,
              },
              time: new Date(1658260800).toISOString(),
            },
            {
              value: {
                doubleValue: 1630005800.0,
              },
              time: new Date(1658260810).toISOString(),
            },
          ],
        },
      ],
      $metadata: {},
    };
    twinMakerClientMock.on(GetPropertyValueHistoryCommand).resolves(mockGetPropertyValueHistoryResponse);
    const mockDataId = createPropertyIndentifierKey(mockEntityId, mockComponentName, mockPropertyId);
    const expectedResult: {
      [id: string]: {
        x: number;
        y: Primitive;
      }[];
    } = {
      [mockDataId]: [
        { x: 1658260800, y: 1630005400.0 },
        { x: 1658260810, y: 1630005800.0 },
      ],
    };
    const propertyValueHistory = await getSinglePropertyValueHistory(
      mockGetPropertyValueHistoryRequest,
      twinMakerClient
    );
    setTimeout(() => {
      expect(propertyValueHistory).toEqual(expectedResult);
    }, 1);
  });

  it('getSinglePropertyValueHistory() - Check return value for Integer type', async () => {
    const mockGetPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput = {
      propertyValues: [
        {
          entityPropertyReference: {
            componentName: mockComponentName,
            entityId: mockEntityId,
            propertyName: mockPropertyId,
          },
          values: [
            {
              value: {
                integerValue: 1630005400,
              },
              time: new Date(1658260800).toISOString(),
            },
            {
              value: {
                integerValue: 1630005800,
              },
              time: new Date(1658260810).toISOString(),
            },
          ],
        },
      ],
      $metadata: {},
    };
    twinMakerClientMock.on(GetPropertyValueHistoryCommand).resolves(mockGetPropertyValueHistoryResponse);
    const mockDataId = createPropertyIndentifierKey(mockEntityId, mockComponentName, mockPropertyId);
    const expectedResult: {
      [id: string]: {
        x: number;
        y: Primitive;
      }[];
    } = {
      [mockDataId]: [
        { x: 1658260800, y: 1630005400 },
        { x: 1658260810, y: 1630005800 },
      ],
    };
    const propertyValueHistory = await getSinglePropertyValueHistory(
      mockGetPropertyValueHistoryRequest,
      twinMakerClient
    );
    setTimeout(() => {
      expect(propertyValueHistory).toEqual(expectedResult);
    }, 1);
  });

  it('getSinglePropertyValueHistory() - Check return value for Long type', async () => {
    const mockGetPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput = {
      propertyValues: [
        {
          entityPropertyReference: {
            componentName: mockComponentName,
            entityId: mockEntityId,
            propertyName: mockPropertyId,
          },
          values: [
            {
              value: {
                longValue: 1630005400,
              },
              time: new Date(1658260800).toISOString(),
            },
            {
              value: {
                longValue: 1630005800,
              },
              time: new Date(1658260810).toISOString(),
            },
          ],
        },
      ],
      $metadata: {},
    };
    twinMakerClientMock.on(GetPropertyValueHistoryCommand).resolves(mockGetPropertyValueHistoryResponse);
    const mockDataId = createPropertyIndentifierKey(mockEntityId, mockComponentName, mockPropertyId);
    const expectedResult: {
      [id: string]: {
        x: number;
        y: Primitive;
      }[];
    } = {
      [mockDataId]: [
        { x: 1658260800, y: 1630005400 },
        { x: 1658260810, y: 1630005800 },
      ],
    };
    const propertyValueHistory = await getSinglePropertyValueHistory(
      mockGetPropertyValueHistoryRequest,
      twinMakerClient
    );
    setTimeout(() => {
      expect(propertyValueHistory).toEqual(expectedResult);
    }, 1);
  });

  it('getSinglePropertyValueHistory() - Check return value for Boolean type', async () => {
    const mockGetPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput = {
      propertyValues: [
        {
          entityPropertyReference: {
            componentName: mockComponentName,
            entityId: mockEntityId,
            propertyName: mockPropertyId,
          },
          values: [
            {
              value: {
                booleanValue: true,
              },
              time: new Date(1658260800).toISOString(),
            },
            {
              value: {
                booleanValue: false,
              },
              time: new Date(1658260810).toISOString(),
            },
          ],
        },
      ],
      $metadata: {},
    };
    twinMakerClientMock.on(GetPropertyValueHistoryCommand).resolves(mockGetPropertyValueHistoryResponse);
    const mockDataId = createPropertyIndentifierKey(mockEntityId, mockComponentName, mockPropertyId);
    const expectedResult: {
      [id: string]: {
        x: number;
        y: Primitive;
      }[];
    } = {
      [mockDataId]: [
        { x: 1658260800, y: true },
        { x: 1658260810, y: false },
      ],
    };
    const propertyValueHistory = await getSinglePropertyValueHistory(
      mockGetPropertyValueHistoryRequest,
      twinMakerClient
    );
    setTimeout(() => {
      expect(propertyValueHistory).toEqual(expectedResult);
    }, 1);
  });

  it('should generate correct key without externalIdProperty', () => {
    const expected = `${mockEntityId}/${mockComponentName}/${mockPropertyId}/`;
    const result = generateEntityRefKey(mockEntityPropertyReference);
    setTimeout(() => {
      expect(result).toEqual(expected);
    }, 1);
  });

  it('should generate correct key with externalIdProperty', () => {
    const expected = `random-key=random-value/${mockPropertyId}/`;
    const result = generateEntityRefKey(mockEntityPropertyReferenceWithExtId);
    setTimeout(() => {
      expect(result).toEqual(expected);
    }, 1);
  });
});
