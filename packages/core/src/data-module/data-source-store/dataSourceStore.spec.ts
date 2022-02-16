import DataSourceStore from './dataSourceStore';
import { DataSource } from '../types';

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

  const request = { viewport: { start: new Date(), end: new Date() }, settings: { fetchFromStartToEnd: true } };

  dataSourceStore.initiateRequest(
    {
      request,
      query,
      onSuccess: () => {},
      onError: () => {},
    },
    []
  );

  expect(customSource.initiateRequest).toBeCalledWith(
    {
      request,
      query,
      onSuccess: expect.toBeFunction(),
      onError: expect.toBeFunction(),
    },
    []
  );
});

it('throws error when attempting to initiate a request to a non-existent data source', () => {
  const dataSourceStore = new DataSourceStore();

  const request = { viewport: { start: new Date(), end: new Date() }, settings: { fetchFromStartToEnd: true } };
  expect(() =>
    dataSourceStore.initiateRequest(
      {
        request,
        query: { source: 'some-name' },
        onSuccess: () => {},
        onError: () => {},
      },
      []
    )
  ).toThrowError(/some-name/);
});
