import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { TimeSeriesDataModule } from '@iot-app-kit/core';
import flushPromises from 'flush-promises';
import { createDataSource } from './data-source';
import { GetEntityResponse, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';

describe('subscribeToTimeSeriesData', () => {
  const tmClient = new IoTTwinMakerClient({});
  const metadataModule = new TwinMakerMetadataModule('ws-1', tmClient);
  const dataModule = new TimeSeriesDataModule(createDataSource(metadataModule, tmClient));
  const mockUpdate = jest.fn();
  const mockUnsubscribe = jest.fn();

  const query = {
    workspaceId: 'ws-1',
    entityId: 'entity-1',
    componentName: 'comp-1',
    properties: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(dataModule, 'subscribeToDataStreams').mockImplementation((input, cb) => {
      cb({ dataStreams: [], viewport: { duration: '5m' }, annotations: {} });
      return { update: mockUpdate, unsubscribe: mockUnsubscribe };
    });
    jest.spyOn(metadataModule, 'fetchEntity').mockResolvedValue({ entityId: 'entity-1' } as GetEntityResponse);
  });

  it('should not fetch entity when queries is empty', () => {
    const subscribe = subscribeToTimeSeriesData(metadataModule, dataModule);
    const cb = jest.fn();
    subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, cb);

    expect(metadataModule.fetchEntity).not.toBeCalled();
  });

  it('should fetch entity when queries is defined properly', async () => {
    const subscribe = subscribeToTimeSeriesData(metadataModule, dataModule);
    const cb = jest.fn();
    subscribe({ queries: [query], request: { viewport: { duration: '5m' } } }, cb);

    expect(metadataModule.fetchEntity).toBeCalledTimes(1);
    expect(cb).toBeCalledTimes(1);
    expect(cb).toBeCalledWith(expect.objectContaining({ dataStreams: [], viewport: { duration: '5m' } }));

    await flushPromises();

    expect(cb).toBeCalledTimes(2);
  });

  it('should call unsubscribe coorrectly', () => {
    const subscribe = subscribeToTimeSeriesData(metadataModule, dataModule);
    const cb = jest.fn();
    const { unsubscribe } = subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, cb);

    unsubscribe();

    expect(mockUnsubscribe).toBeCalledTimes(1);
  });

  it('should update as expected', async () => {
    const subscribe = subscribeToTimeSeriesData(metadataModule, dataModule);
    const cb = jest.fn();
    const { update } = subscribe({ queries: [query], request: { viewport: { duration: '5m' } } }, cb);

    expect(metadataModule.fetchEntity).toBeCalledTimes(1);

    update({ queries: [query] });

    expect(mockUpdate).toBeCalledTimes(1);
    expect(metadataModule.fetchEntity).toBeCalledTimes(2);
  });
});
