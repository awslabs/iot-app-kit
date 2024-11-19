import DataSourceStore from './dataSourceStore';
import type { DataSource } from '../types';

it('initiate a request on a registered data source', () => {
  const customSource: DataSource = {
    initiateRequest: vi.fn(),
    getRequestsFromQuery: () => Promise.resolve([]),
  };
  const dataSourceStore = new DataSourceStore(customSource);

  const query = { source: 'custom' };

  const request = {
    viewport: { start: new Date(), end: new Date() },
    settings: { fetchFromStartToEnd: true },
  };

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
