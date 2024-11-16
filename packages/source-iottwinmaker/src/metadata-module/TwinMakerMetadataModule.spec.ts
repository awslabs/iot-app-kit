import { type GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import { type ErrorDetails } from '@iot-app-kit/core';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';
import { TwinMakerMetadataModule } from './TwinMakerMetadataModule';
import { QueryClient } from '@tanstack/query-core';
import { type FetchEntityErrorMeta } from './types';

const createCache = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

describe('TwinMakerMetadataModule', () => {
  const mockEntity1 = { entityId: 'test-1' } as GetEntityResponse;
  const mockEntity2 = { entityId: 'test-2' } as GetEntityResponse;

  let cache: QueryClient = createCache();
  let module: TwinMakerMetadataModule;

  describe('fetchEntity', () => {
    const getEntity = jest.fn();
    const mockTMClient = createMockTwinMakerSDK({
      getEntity,
    });
    beforeEach(() => {
      jest.clearAllMocks();

      cache = createCache();
      module = new TwinMakerMetadataModule('ws-id', mockTMClient, cache);
    });

    it('should send request when the entity is not in the cache', async () => {
      getEntity.mockResolvedValue(mockEntity1);
      const entity = await module.fetchEntity({
        entityId: mockEntity1.entityId!,
      });
      expect(getEntity).toBeCalledTimes(1);
      expect(entity).toEqual(mockEntity1);
    });

    it('should not send request when the request for the same entity is in process', async () => {
      getEntity.mockResolvedValue(mockEntity1);
      const entities = await Promise.all([
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
      ]);
      expect(getEntity).toBeCalledTimes(1);
      expect(entities[0]).toEqual(mockEntity1);
      expect(entities[1]).toEqual(mockEntity1);
    });

    it('should send request when multiple calls for the different entities are triggered', async () => {
      getEntity.mockResolvedValue(mockEntity1);
      await Promise.all([
        module.fetchEntity({ entityId: mockEntity1.entityId! }),
        module.fetchEntity({ entityId: 'xx-yy-zz' }),
      ]);
      expect(getEntity).toBeCalledTimes(2);
    });

    it('should return cached entity when one is in the cache', async () => {
      getEntity.mockResolvedValue(mockEntity1);
      await module.fetchEntity({ entityId: mockEntity1.entityId! });
      jest.clearAllMocks();

      const entity = await module.fetchEntity({
        entityId: mockEntity1.entityId!,
      });
      expect(getEntity).not.toBeCalled();
      expect(entity).toEqual(mockEntity1);
    });

    it('should throw error when request failed', async () => {
      const mockError = {
        name: 'random-error-name',
        message: 'random-error-message',
        $metadata: { httpStatusCode: '401' },
      };
      const mockErrorDetails: ErrorDetails<FetchEntityErrorMeta> = {
        msg: mockError.message,
        type: mockError.name,
        status: mockError.$metadata.httpStatusCode,
        meta: { entityId: 'random' },
      };
      getEntity.mockRejectedValue(mockError as never);

      try {
        await module.fetchEntity({ entityId: 'random' });
      } catch (err) {
        expect(err).toEqual(mockErrorDetails);
        expect(getEntity).toBeCalledTimes(1);
      }
    });
  });

  describe('fetchEntitiesByComponentTypeId', () => {
    const mockComponentTypeId = 'test-comp-1';
    const getEntity = jest.fn();
    const listEntities = jest.fn();
    const mockTMClient = createMockTwinMakerSDK({
      getEntity,
      listEntities,
    });

    beforeEach(() => {
      jest.clearAllMocks();
      listEntities
        .mockResolvedValueOnce({
          entitySummaries: [mockEntity1],
          nextToken: 'xxyyzz',
        })
        .mockResolvedValueOnce({ entitySummaries: [mockEntity2] });
      getEntity.mockResolvedValueOnce(mockEntity1);
      getEntity.mockResolvedValueOnce(mockEntity2);

      cache = createCache();
      module = new TwinMakerMetadataModule('ws-id', mockTMClient, cache);
    });

    it('should send request when the component type is not in the cache', async () => {
      const entities = await module.fetchEntitiesByComponentTypeId({
        componentTypeId: mockComponentTypeId,
      });
      expect(entities).toEqual([mockEntity1, mockEntity2]);
    });

    it('should not send request when the request for the same component type is in process', async () => {
      jest.spyOn(mockTMClient, 'send').mockResolvedValueOnce({} as never);

      await Promise.all([
        module.fetchEntitiesByComponentTypeId({
          componentTypeId: mockComponentTypeId,
        }),
        module.fetchEntitiesByComponentTypeId({
          componentTypeId: mockComponentTypeId,
        }),
      ]);
      expect(mockTMClient.send).toBeCalledTimes(1);
    });

    it('should send request when multiple calls for the different component types are triggered', async () => {
      jest
        .spyOn(mockTMClient, 'send')
        .mockResolvedValueOnce({} as never)
        .mockResolvedValueOnce({} as never);

      await Promise.all([
        module.fetchEntitiesByComponentTypeId({
          componentTypeId: mockComponentTypeId,
        }),
        module.fetchEntitiesByComponentTypeId({ componentTypeId: 'xx-yy-zz' }),
      ]);
      expect(mockTMClient.send).toBeCalledTimes(2);
    });

    it('should return cached entities when available in the cache', async () => {
      await module.fetchEntitiesByComponentTypeId({
        componentTypeId: mockComponentTypeId,
      });

      jest.clearAllMocks();
      const entities = await module.fetchEntitiesByComponentTypeId({
        componentTypeId: mockComponentTypeId,
      });
      expect(entities).toEqual([mockEntity1, mockEntity2]);
      expect(listEntities).not.toBeCalled();
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
      getEntity.mockRejectedValue(mockError as never);

      try {
        await module.fetchEntitiesByComponentTypeId({
          componentTypeId: 'random',
        });
      } catch (err) {
        expect(err).toEqual(mockErrorDetails);
        expect(getEntity).toBeCalledTimes(1);
      }
    });
  });

  describe('fetchEntitiesSummaries', () => {
    const listEntities = jest.fn();
    const mockTMClient = createMockTwinMakerSDK({
      listEntities,
    });

    beforeEach(() => {
      jest.clearAllMocks();
      listEntities
        .mockResolvedValueOnce({
          entitySummaries: [mockEntity1],
          nextToken: 'xxyyzz',
        })
        .mockResolvedValueOnce({ entitySummaries: [mockEntity2] });

      cache = createCache();
      module = new TwinMakerMetadataModule('ws-id', mockTMClient, cache);
    });

    it('should send request when data is not in the cache', async () => {
      const entities = await module.fetchEntitiesSummaries();
      expect(entities).toEqual([mockEntity1, mockEntity2]);
    });

    it('should not send request when the same request is in process', async () => {
      jest.spyOn(mockTMClient, 'send').mockResolvedValueOnce({} as never);

      await Promise.all([
        module.fetchEntitiesSummaries(),
        module.fetchEntitiesSummaries(),
      ]);
      expect(mockTMClient.send).toBeCalledTimes(1);
    });

    it('should return cached entities when available in the cache', async () => {
      await module.fetchEntitiesSummaries();

      jest.clearAllMocks();
      const entities = await module.fetchEntitiesSummaries();
      expect(entities).toEqual([mockEntity1, mockEntity2]);
      expect(listEntities).not.toBeCalled();
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
      listEntities.mockRejectedValue(mockError as never);

      try {
        await module.fetchEntitiesSummaries();
      } catch (err) {
        expect(err).toEqual(mockErrorDetails);
        expect(listEntities).toBeCalledTimes(1);
      }
    });
  });
});
