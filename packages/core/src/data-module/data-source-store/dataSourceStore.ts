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

  public getRequestsFromQueries = async ({
    queries,
    request,
  }: {
    queries: Query[];
    request: TimeSeriesDataRequest;
  }): Promise<RequestInformation[]> => {
    const requestInformations = await Promise.all(
      queries.map((query) => this.getRequestsFromQuery({ query, request }))
    );
    return requestInformations.flat();
  };

  private getRequestsFromQuery = ({
    query,
    request,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }): Promise<RequestInformation[]> => {
    return this.dataSource
      .getRequestsFromQuery({ query, request })
      .then((requestInformations) =>
        requestInformations.map((requestInfo) => ({ ...requestInfo, cacheSettings: query.cacheSettings }))
      );
  };

  public initiateRequest = (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => {
    this.dataSource.initiateRequest(request, requestInformations);
  };
}
