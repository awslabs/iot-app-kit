import { type GetPropertyValueCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { createMockTwinMakerSDK } from '../../__mocks__/iottwinmakerSDK';

import { getPropertyValueByEntity } from './getPropertyValueByEntity';
import { type TwinMakerStaticDataQuery } from '../types';

describe('getPropertyValueByEntity', () => {
  const mockEntityRef1 = {
    entityId: 'entity-1',
    componentName: 'comp-1',
    propertyName: 'prop-1',
  };
  const mockEntityRef2 = {
    entityId: 'entity-2',
    componentName: 'comp-2',
    propertyName: 'prop-2',
  };
  const mockEntityRef3 = {
    ...mockEntityRef2,
    propertyName: 'prop-3',
  };
  const mockQuery1: TwinMakerStaticDataQuery = {
    workspaceId: 'ws-1',
    entityId: mockEntityRef1.entityId,
    componentName: mockEntityRef1.componentName,
    properties: [
      {
        propertyName: mockEntityRef1.propertyName,
      },
    ],
  };
  const mockQuery2: TwinMakerStaticDataQuery = {
    workspaceId: 'ws-1',
    entityId: mockEntityRef2.entityId,
    componentName: mockEntityRef2.componentName,
    properties: [
      {
        propertyName: mockEntityRef2.propertyName,
      },
      {
        propertyName: mockEntityRef3.propertyName,
      },
    ],
  };

  const getPropertyValue = jest.fn();
  const tmClient = createMockTwinMakerSDK({
    getPropertyValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send correct request and return correct data with multiple properties', async () => {
    const mockAPIResponse: GetPropertyValueCommandOutput = {
      $metadata: {},
      propertyValues: {
        [mockEntityRef2.propertyName]: {
          propertyReference: mockEntityRef2,
          propertyValue: {
            longValue: 111,
          },
        },
        [mockEntityRef3.propertyName]: {
          propertyReference: mockEntityRef3,
          propertyValue: {
            booleanValue: true,
          },
        },
      },
    };
    getPropertyValue.mockResolvedValue(mockAPIResponse);
    const result = await getPropertyValueByEntity({
      query: mockQuery2,
      client: tmClient,
    });

    expect(getPropertyValue).toBeCalledWith({
      workspaceId: mockQuery2.workspaceId,
      entityId: mockQuery2.entityId,
      componentName: mockQuery2.componentName,
      selectedProperties: [
        mockEntityRef2.propertyName,
        mockEntityRef3.propertyName,
      ],
    });
    expect(result).toEqual([
      {
        dataType: 'NUMBER',
        data: [{ y: 111 }],
        meta: mockEntityRef2,
      },
      {
        dataType: 'BOOLEAN',
        data: [{ y: 'true' }],
        meta: mockEntityRef3,
      },
    ]);
  });

  it('should return correct result with nextToken', async () => {
    const mockAPIResponse1: GetPropertyValueCommandOutput = {
      nextToken: '11223344',
      $metadata: {},
      propertyValues: {
        [mockEntityRef1.propertyName]: {
          propertyReference: mockEntityRef1,
          propertyValue: {
            stringValue: 'result-1',
          },
        },
      },
    };
    const mockAPIResponse2: GetPropertyValueCommandOutput = {
      nextToken: undefined,
      $metadata: {},
      propertyValues: {
        [mockEntityRef1.propertyName]: {
          propertyReference: mockEntityRef1,
          propertyValue: {
            stringValue: 'result-2',
          },
        },
      },
    };
    getPropertyValue
      .mockResolvedValueOnce(mockAPIResponse1)
      .mockResolvedValueOnce(mockAPIResponse2);

    const result = await getPropertyValueByEntity({
      query: mockQuery1,
      client: tmClient,
    });

    expect(result).toEqual([
      expect.objectContaining({
        data: [
          {
            y: 'result-1',
          },
        ],
        dataType: 'STRING',
        meta: mockEntityRef1,
      }),
      expect.objectContaining({
        data: [
          {
            y: 'result-2',
          },
        ],
        meta: mockEntityRef1,
        dataType: 'STRING',
      }),
    ]);
  });
});
