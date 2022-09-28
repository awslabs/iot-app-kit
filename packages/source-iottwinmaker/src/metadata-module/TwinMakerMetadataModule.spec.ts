import {
  GetEntityCommand,
  GetEntityResponse,
  IoTTwinMakerClient,
  ListEntitiesCommand,
} from '@aws-sdk/client-iottwinmaker';
import { ErrorDetails } from '@iot-app-kit/core';
import { mockClient } from 'aws-sdk-client-mock';
import { TwinMakerMetadataCache } from './TwinMakerMetadataCache';
import { TwinMakerMetadataModule } from './TwinMakerMetadataModule';

describe('TwinMakerMetadataModule', () => {
  const mockEntity1 = { entityId: 'test-1' } as GetEntityResponse;
  const mockEntity2 = { entityId: 'test-2' } as GetEntityResponse;
  let tmClient = new IoTTwinMakerClient({});

  let cache: TwinMakerMetadataCache = new TwinMakerMetadataCache();
  let module: TwinMakerMetadataModule;

  describe('fetchEntity', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      tmClient = new IoTTwinMakerClient({});
      jest.spyOn(tmClient, 'send').mockResolvedValue(mockEntity1 as never);

      cache = new TwinMakerMetadataCache();
      module = new TwinMakerMetadataModule('ws-id', tmClient, cache);
    });

    it('should send request when the entity is not in the cache', async () => {
      expect(cache.getEntity(mockEntity1.entityId!)).toBeUndefined();

      const entity = await module.fetchEntity({ entityId: mockEntity1.entityId! });
      expect(tmClient.send).toBeCalledTimes(1);
      expect(entity).toEqual(mockEntity1);
    });

    it('should not send request when the request for the same entity is in process', async () => {
      expect(cache.getEntity(mockEntity1.entityId!)).toBeUndefined();

      const entities = await Promise.all([
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
      ]);
      expect(tmClient.send).toBeCalledTimes(1);
      expect(entities[0]).toEqual(mockEntity1);
      expect(entities[1]).toEqual(mockEntity1);
    });

    it('should send request when multiple calls for the different entities are triggered', async () => {
      expect(cache.getEntity(mockEntity1.entityId!)).toBeUndefined();

      await Promise.all([
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
        module.fetchEntity({ entityId: 'xx-yy-zz' }),
      ]);
      expect(tmClient.send).toBeCalledTimes(2);
    });

    it('should return cached entity when one is in the cache', async () => {
      await module.fetchEntity({ entityId: mockEntity1.entityId! });
      jest.clearAllMocks();

      const entity = await module.fetchEntity({ entityId: mockEntity1.entityId! });
      expect(tmClient.send).not.toBeCalled();
      expect(entity).toEqual(mockEntity1);
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

  describe('fetchEntitiesByComponentTypeId', () => {
    const mockComponentTypeId = 'test-comp-1';
    let mockTMClient = mockClient(tmClient);

    beforeEach(() => {
      jest.clearAllMocks();
      tmClient = new IoTTwinMakerClient({});
      mockTMClient = mockClient(tmClient);
      mockTMClient
        .on(ListEntitiesCommand)
        .resolvesOnce({ entitySummaries: [mockEntity1], nextToken: 'xxyyzz' })
        .resolvesOnce({ entitySummaries: [mockEntity2] });
      mockTMClient.on(GetEntityCommand, { entityId: mockEntity1.entityId }).resolves(mockEntity1);
      mockTMClient.on(GetEntityCommand, { entityId: mockEntity2.entityId }).resolves(mockEntity2);

      cache = new TwinMakerMetadataCache();
      module = new TwinMakerMetadataModule('ws-id', tmClient, cache);
    });

    it('should send request when the component type is not in the cache', async () => {
      expect(cache.getEntitySummariesByComponentType(mockComponentTypeId)).toBeUndefined();

      const entities = await module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId });
      expect(entities).toEqual([mockEntity1, mockEntity2]);
    });

    it('should not send request when the request for the same component type is in process', async () => {
      expect(cache.getEntitySummariesByComponentType(mockComponentTypeId)).toBeUndefined();

      jest.spyOn(tmClient, 'send').mockResolvedValue({} as never);

      await Promise.all([
        module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId }),
        module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId }),
      ]);
      expect(tmClient.send).toBeCalledTimes(1);
    });

    it('should send request when multiple calls for the different component types are triggered', async () => {
      expect(cache.getEntitySummariesByComponentType(mockComponentTypeId)).toBeUndefined();

      jest.spyOn(tmClient, 'send').mockResolvedValue({} as never);

      await Promise.all([
        module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId }),
        module.fetchEntitiesByComponentTypeId({ componentTypeId: 'xx-yy-zz' }),
      ]);
      expect(tmClient.send).toBeCalledTimes(2);
    });

    it('should return cached entities when available in the cache', async () => {
      await module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId });

      jest.spyOn(tmClient, 'send').mockResolvedValue({} as never);

      const entities = await module.fetchEntitiesByComponentTypeId({ componentTypeId: mockComponentTypeId });
      expect(entities).toEqual([mockEntity1, mockEntity2]);
      expect(tmClient.send).not.toBeCalled();
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
        await module.fetchEntitiesByComponentTypeId({ componentTypeId: 'random' });
      } catch (err) {
        expect(err).toEqual(mockErrorDetails);
        expect(tmClient.send).toBeCalledTimes(1);
      }
    });
  });
});
