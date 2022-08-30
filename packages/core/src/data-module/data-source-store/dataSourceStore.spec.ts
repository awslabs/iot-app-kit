import DataSourceStore from './dataSourceStore';
import { DataSource } from '../types';

it('initiate a request on a registered data source', () => {
  const customSource: DataSource = { initiateRequest: jest.fn(), getRequestsFromQuery: () => [] };
  const dataSourceStore = new DataSourceStore(customSource);

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
