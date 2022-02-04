import { MinimalViewPortConfig } from '@synchro-charts/core';
import { DataSource, DataSourceName, DataSourceRequest, DataStreamQuery, RequestInformation } from '../types.d';
import { TimeSeriesDataRequest } from '../data-cache/requestTypes';

/**
 * Manages the collection of registered data sources, as well as delegating requests to the correct data-source.
 *
 * Data sources enable queries to be made to return data streams for use throughout.
 */
export default class DataSourceStore {
  // Currently, there are no data sources provided by default, but we will add defaults here as they are produced.
  private dataSources: { [name: string]: DataSource } = {};

  private getDataSource = (source: DataSourceName): DataSource => {
    if (this.dataSources[source] == null) {
      throw new Error(
        `Expected to find a data source with the name "${source}", but could not find the requested data source.`
      );
    }

    return this.dataSources[source];
  };

  public getRequestsFromQueries = <Query extends DataStreamQuery>({
    queries,
    request,
    viewport,
  }: {
    queries: Query[];
    request: TimeSeriesDataRequest;
    viewport: MinimalViewPortConfig;
  }): RequestInformation[] => queries.map((query) => this.getRequestsFromQuery({ query, request, viewport })).flat();

  public getRequestsFromQuery = <Query extends DataStreamQuery>({
    query,
    request,
    viewport,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
    viewport: MinimalViewPortConfig;
  }): RequestInformation[] => {
    const dataSource = this.getDataSource(query.source);
    return dataSource
      .getRequestsFromQuery({ query, request, viewport })
      .map((request) => ({ ...request, cacheSettings: query.cacheSettings }));
  };

  public initiateRequest = <Query extends DataStreamQuery>(request: DataSourceRequest<Query>) => {
    const dataSource = this.getDataSource(request.query.source);
    dataSource.initiateRequest(request);
  };

  public registerDataSource = <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => {
    if (this.dataSources[dataSource.name] != null) {
      throw new Error(
        `Attempted to add a data source with a name of "${dataSource.name}",
        but the provided data source name is already present.`
      );
    }

    this.dataSources[dataSource.name] = dataSource;
  };
}
