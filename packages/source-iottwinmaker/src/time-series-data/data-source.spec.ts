import { MINUTE_IN_MS, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

import * as api from './client/getPropertyValueHistoryByEntity';
import { createDataSource } from './data-source';
import { TwinMakerDataStreamQuery } from './types';

it('initializes', () => {
  expect(() => createDataSource(new IoTTwinMakerClient({}))).not.toThrowError();
});
const noop = () => {};

const LAST_MINUTE_REQUEST: TimeSeriesDataRequest = {
  viewport: {
    duration: MINUTE_IN_MS,
  },
  settings: {
    fetchMostRecentBeforeEnd: true,
  },
};

describe('initiateRequest', () => {
  it('does call getPropertyValueHistoryByEntity', () => {
    const apiSpy = jest.spyOn(api, 'getPropertyValueHistoryByEntity').mockImplementation(() => Promise.resolve());
    const tmClient = new IoTTwinMakerClient({});
    const dataSource = createDataSource(tmClient);
    const query = {
      workspaceId: 'ws-1',
      entityId: 'entity-1',
      componentName: 'comp-1',
      properties: [{ propertyName: 'prop-1' }],
    };

    dataSource.initiateRequest(
      {
        onError: noop,
        onSuccess: noop,
        query,
        request: LAST_MINUTE_REQUEST,
      },
      []
    );

    expect(apiSpy).toBeCalledTimes(1);
    expect(apiSpy).toBeCalledWith({
      onError: noop,
      onSuccess: noop,
      client: tmClient,
      requestInformations: [],
    });
  });
});

describe('getRequestsFromQuery', () => {
  it('should create expected request for entity query', () => {
    const tmClient = new IoTTwinMakerClient({});
    const dataSource = createDataSource(tmClient);
    const REF_ID = 'some-ref';

    const query: TwinMakerDataStreamQuery = {
      workspaceId: 'ws-1',
      entityId: 'entity-1',
      componentName: 'comp-1',
      properties: [
        { propertyName: 'prop-1', refId: REF_ID },
        { propertyName: 'prop-2', refId: REF_ID + REF_ID },
      ],
    };

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    const result = dataSource.getRequestsFromQuery({ query, request });
    expect(result[0]).toEqual(expect.objectContaining({ refId: REF_ID, resolution: '0' }));
    expect(result[1]).toEqual(expect.objectContaining({ refId: REF_ID + REF_ID, resolution: '0' }));
  });

  it('should return empty request for non entity query', () => {
    const tmClient = new IoTTwinMakerClient({});
    const dataSource = createDataSource(tmClient);
    const REF_ID = 'some-ref';

    const query = {
      workspaceId: 'ws-1',
      componentName: 'comp-1',
      properties: [
        { propertyName: 'prop-1', refId: REF_ID },
        { propertyName: 'prop-2', refId: REF_ID + REF_ID },
      ],
    } as TwinMakerDataStreamQuery;

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    const result = dataSource.getRequestsFromQuery({ query, request });
    expect(result).toEqual([]);
  });
});
