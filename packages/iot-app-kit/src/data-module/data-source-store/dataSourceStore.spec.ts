import DataSourceStore from './dataSourceStore';
import { DataSource } from '../types.d';

it('registers a data source', () => {
  const dataSourceStore = new DataSourceStore();
  expect(() =>
    dataSourceStore.registerDataSource({ name: 'custom', initiateRequest: () => {}, getRequestsFromQuery: () => [] })
  ).not.toThrowError();
});

it('initiate a request on a registered data source', () => {
  const dataSourceStore = new DataSourceStore();
  const customSource: DataSource = { name: 'custom', initiateRequest: jest.fn(), getRequestsFromQuery: () => [] };

  dataSourceStore.registerDataSource(customSource);

  const query = { source: 'custom' };

  const requestInfo = { start: new Date(), end: new Date(), onlyFetchLatestValue: false };
  dataSourceStore.initiateRequest(
    {
      requestInfo,
      query,
      onSuccess: () => {},
      onError: () => {},
    },
    []
  );

  expect(customSource.initiateRequest).toBeCalledWith(
    {
      requestInfo,
      query,
      onSuccess: expect.toBeFunction(),
      onError: expect.toBeFunction(),
    },
    []
  );
});

it('throws error when attempting to initiate a request to a non-existent data source', () => {
  const dataSourceStore = new DataSourceStore();

  const requestInfo = { start: new Date(), end: new Date(), onlyFetchLatestValue: false };
  expect(() =>
    dataSourceStore.initiateRequest(
      {
        requestInfo,
        query: { source: 'some-name' },
        onSuccess: () => {},
        onError: () => {},
      },
      []
    )
  ).toThrowError(/some-name/);
});
