import { DataSource, DataStreamQuery } from '../../data-module/types.d';

/**
 * Simple mocked data source.
 */

const mockedDataSource: DataSource<DataStreamQuery> = {
  name: 'mocked-data-source',
  initiateRequest: () => {},
  getRequestsFromQuery: () => [],
};

export default mockedDataSource;
