import { DataSource } from '../../data-module/types.d';
import { RociDataStreamQuery } from './types.d';

const dataSource: DataSource<RociDataStreamQuery> = {
  name: 'roci',
  initiateRequest: () => {
    // TODO: Implement
  },
  // never requests
  getRequestsFromQuery: () => [],
};

export default dataSource;
