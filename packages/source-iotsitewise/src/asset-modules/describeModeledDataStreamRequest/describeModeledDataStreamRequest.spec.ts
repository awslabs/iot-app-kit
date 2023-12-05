import {
  DescribeAssetCommandOutput,
  ListAssetModelPropertiesCommandOutput,
  ListAssetPropertiesCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { DescribeModeledDataStreamRequest } from './describeModeledDataStreamRequest';

describe(DescribeModeledDataStreamRequest, () => {
  it('builds', () => {
    const client = { send: jest.fn() } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    expect(request).not.toBeNull();
  });

  it('returns a modeled data stream from an asset', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const client = {
      send: jest.fn().mockResolvedValueOnce(fakeDescribeAssetCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: '123',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();
  });

  it('returns a cached modeled data stream from an asset', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const client = {
      send: jest.fn().mockResolvedValueOnce(fakeDescribeAssetCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    await request.send({
      assetPropertyId: '123',
      assetId: '456',
      assetModelId: '789',
    });

    await request.send({
      assetPropertyId: '123',
      assetId: '456',
      assetModelId: '789',
    });

    expect(client.send).toHaveBeenCalledOnce();
  });

  it('returns a different modeled data stream from a cached asset without making another request', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
        {
          id: 'poiu',
          name: 'asset property 2',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const client = {
      send: jest.fn().mockResolvedValueOnce(fakeDescribeAssetCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    await request.send({
      assetPropertyId: '123',
      assetId: '456',
      assetModelId: '789',
    });

    await request.send({
      assetPropertyId: 'poiu',
      assetId: '456',
      assetModelId: '789',
    });

    expect(client.send).toHaveBeenCalledOnce();
  });

  it('returns a composite model property from an asset', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const client = {
      send: jest.fn().mockResolvedValueOnce(fakeDescribeAssetCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'xyz',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();
  });

  it('calls list APIs if the asset property is not on the asset', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutput: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }],
      $metadata: {},
    };

    const fakeListAssetModelPropertiesCommandOutput: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutput)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'asdf',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();
  });

  it('returns cached properties from list calls', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutput: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }, { id: 'poiu' }],
      $metadata: {},
    };

    const fakeListAssetModelPropertiesCommandOutput: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property 1', dataType: 'DOUBLE', type: {} },
        { id: 'poiu', name: 'nested composite model property 2', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutput)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutput),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    await request.send({
      assetPropertyId: 'asdf',
      assetId: '456',
      assetModelId: '789',
    });

    await request.send({
      assetPropertyId: 'poiu',
      assetId: '456',
      assetModelId: '789',
    });

    expect(client.send).toHaveBeenCalledTimes(3);
  });

  it('paginates when finding nested composite model properties', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutputPage1: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }],
      $metadata: {},
      nextToken: '123',
    };

    const fakeListAssetPropertiesCommandOutputPage2: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: 'zxcv' }],
      $metadata: {},
    };

    const fakeListAssetModelPropertiesCommandOutputPage1: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
      nextToken: '123',
    };

    const fakeListAssetModelPropertiesCommandOutputPage2: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: 'zxcv', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage2)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage2),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'zxcv',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();
  });

  it('stops paginating if property is found but there are more pages', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutputPage1: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }],
      $metadata: {},
      nextToken: '123',
    };

    const fakeListAssetModelPropertiesCommandOutputPage1: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
      nextToken: '123',
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage1),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'asdf',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();

    expect(client.send).toHaveBeenCalledTimes(3);
  });

  it('resumes paginating if property', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutputPage1: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }],
      $metadata: {},
      nextToken: '123',
    };

    const fakeListAssetPropertiesCommandOutputPage2: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: 'zxcv' }],
      $metadata: {},
    };

    const fakeListAssetModelPropertiesCommandOutputPage1: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
      nextToken: '123',
    };

    const fakeListAssetModelPropertiesCommandOutputPage2: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: 'zxcv', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage2)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage2),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'asdf',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).not.toBeUndefined();

    expect(client.send).toHaveBeenCalledTimes(3);

    const response2 = await request.send({
      assetPropertyId: 'zxcv',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response2).not.toBeUndefined();

    expect(client.send).toHaveBeenCalledTimes(5);
  });

  it('returns undefined if the property does not exist', async () => {
    const fakeDescribeAssetCommandOutput: DescribeAssetCommandOutput = {
      assetId: '456',
      assetModelId: '789',
      assetArn: '',
      assetCompositeModels: [
        {
          name: 'composite model',
          type: 'composite model type',
          properties: [
            {
              id: 'xyz',
              name: 'composite model property',
              dataType: 'DOUBLE',
            },
          ],
        },
      ],
      assetProperties: [
        {
          id: '123',
          name: 'asset property',
          dataType: 'DOUBLE',
        },
      ],
      assetName: 'asset',
      assetCreationDate: new Date(0),
      assetLastUpdateDate: new Date(0),
      assetHierarchies: [],
      assetStatus: {
        state: 'ACTIVE',
      },
      $metadata: {},
    };

    const fakeListAssetPropertiesCommandOutputPage1: ListAssetPropertiesCommandOutput = {
      assetPropertySummaries: [{ id: '123' }, { id: 'xyz' }, { id: 'asdf' }],
      $metadata: {},
    };

    const fakeListAssetModelPropertiesCommandOutputPage1: ListAssetModelPropertiesCommandOutput = {
      assetModelPropertySummaries: [
        { id: '123', name: 'asset property', dataType: 'DOUBLE', type: {} },
        { id: 'xyz', name: 'composite model property', dataType: 'DOUBLE', type: {} },
        { id: 'asdf', name: 'nested composite model property', dataType: 'DOUBLE', type: {} },
      ],
      $metadata: {},
    };

    const client = {
      send: jest
        .fn()
        .mockResolvedValueOnce(fakeDescribeAssetCommandOutput)
        .mockResolvedValueOnce(fakeListAssetPropertiesCommandOutputPage1)
        .mockResolvedValueOnce(fakeListAssetModelPropertiesCommandOutputPage1),
    } as unknown as IoTSiteWiseClient;
    const request = new DescribeModeledDataStreamRequest(client);

    const response = await request.send({
      assetPropertyId: 'does not exist',
      assetId: '456',
      assetModelId: '789',
    });

    expect(response).toBeUndefined();
  });
});
