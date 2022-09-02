import {
  DataSource,
  DataSourceRequest,
  DataStreamQuery,
  RequestInformation,
  RequestInformationAndRange,
} from '../types';
import { TimeSeriesDataRequest } from '../data-cache/requestTypes';

export default class DataSourceStore<Query extends DataStreamQuery> {
  private dataSource: DataSource<Query>;

  constructor(dataSource: DataSource<Query>) {
    this.dataSource = dataSource;
  }

  public getRequestsFromQueries = ({
    queries,
    request,
  }: {
    queries: Query[];
    request: TimeSeriesDataRequest;
  }): RequestInformation[] => queries.map((query) => this.getRequestsFromQuery({ query, request })).flat();

  public getRequestsFromQuery = ({
    query,
    request,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }): RequestInformation[] => {
    return this.dataSource
      .getRequestsFromQuery({ query, request })
      .map((request) => ({ ...request, cacheSettings: query.cacheSettings }));
  };

  public initiateRequest = (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => {
    this.dataSource.initiateRequest(request, requestInformations);
  };
}
