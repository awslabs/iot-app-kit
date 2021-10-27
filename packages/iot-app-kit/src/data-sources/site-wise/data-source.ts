import { DataSource } from '../../data-module/types.d';
import { SiteWiseDataStreamQuery } from './types.d';

const dataSource: DataSource<SiteWiseDataStreamQuery> = {
  name: 'site-wise',
  initiateRequest: () => {
    // TODO: Implement
  },
  // never requests anything
  getRequestsFromQuery: () => [],
};

export default dataSource;
