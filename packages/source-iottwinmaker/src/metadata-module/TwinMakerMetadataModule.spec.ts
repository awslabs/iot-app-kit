import { GetEntityResponse, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { ErrorDetails } from '@iot-app-kit/core';
import { TwinMakerMetadataCache } from './TwinMakerMetadataCache';
import { TwinMakerMetadataModule } from './TwinMakerMetadataModule';

describe('TwinMakerMetadataModule', () => {
  const mockEntity = { entityId: 'test-1' } as GetEntityResponse;
  const tmClient = new IoTTwinMakerClient({});

  let cache: TwinMakerMetadataCache = new TwinMakerMetadataCache();
  let module: TwinMakerMetadataModule;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(tmClient, 'send').mockResolvedValue(mockEntity as never);

    cache = new TwinMakerMetadataCache();
    module = new TwinMakerMetadataModule('ws-id', tmClient, cache);
  });

  it('should send request when the entity is not in the cache', async () => {
    cache.storeEntity({ entityId: 'random' } as GetEntityResponse);
    expect(cache.getEntity(mockEntity.entityId!)).toBeUndefined();

    const entity = await module.fetchEntity({ entityId: mockEntity.entityId! });
    expect(tmClient.send).toBeCalledTimes(1);
    expect(entity).toEqual(mockEntity);
  });

  it('should return cached entity when one is in the cache', async () => {
    cache.storeEntity(mockEntity);

    const entity = await module.fetchEntity({ entityId: mockEntity.entityId! });
    expect(tmClient.send).not.toBeCalled();
    expect(entity).toEqual(mockEntity);
  });

  it('should throw error when request failed', async () => {
    const mockError = {
      name: 'random-error-name',
      message: 'random-error-message',
      $metadata: { httpStatusCode: '401' },
    };
    const mockErrorDetails: ErrorDetails = {
      msg: mockError.message,
      type: mockError.name,
      status: mockError.$metadata.httpStatusCode,
    };
    jest.spyOn(tmClient, 'send').mockRejectedValue(mockError as never);

    try {
      await module.fetchEntity({ entityId: 'random' });
    } catch (err) {
      expect(err).toEqual(mockErrorDetails);
      expect(tmClient.send).toBeCalledTimes(1);
    }
  });
});
