import type {
  DataSource,
  DataSourceRequest,
  DataStreamQuery,
  RequestInformation,
  RequestInformationAndRange,
} from '../types';
import type { TimeSeriesDataRequest } from '../data-cache/requestTypes';

export class DataSourceStore<Query extends DataStreamQuery> {
  private dataSource: DataSource<Query>;

  constructor(dataSource: DataSource<Query>) {
    this.dataSource = dataSource;
  }

  public async getRequestsFromQueries({
    queries,
    request,
  }: {
    queries: Query[];
    request: TimeSeriesDataRequest;
  }): Promise<RequestInformation[]> {
    const requests = await Promise.all(
      queries.map((query) => this.getRequestsFromQuery({ query, request }))
    );

    return requests.flat();
  }

  public initiateRequest(
    request: DataSourceRequest<Query>,
    requestInformations: RequestInformationAndRange[]
  ): void {
    void this.dataSource.initiateRequest(request, requestInformations);
  }

  private async getRequestsFromQuery({
    query,
    request,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }): Promise<RequestInformation[]> {
    const requests = await this.dataSource.getRequestsFromQuery({
      query,
      request,
    });

    return requests.map((req) => ({
      ...req,
      cacheSettings: query.cacheSettings,
    }));
  }
}
