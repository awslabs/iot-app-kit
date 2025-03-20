import type {
  AssetHierarchyQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetSummaryQuery,
  CachedAssetSummaryBlock,
  HierarchyAssetSummaryList,
  SiteWiseAssetDataSource,
} from './types';
import { assetHierarchyQueryKey, HIERARCHY_ROOT_ID } from './types';
import { EMPTY, Observable, type Subscriber } from 'rxjs';
import type {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetModelResponse,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import {
  ListAssetsFilter,
  TraversalDirection,
} from '@aws-sdk/client-iotsitewise';
import { type SiteWiseAssetCache } from './cache';
import { SiteWiseAssetSession } from './session';
import { RequestProcessorWorkerGroup } from './requestProcessorWorkerGroup';
import { expand, map } from 'rxjs/operators';

export class RequestProcessor {
  private readonly api: SiteWiseAssetDataSource;
  private readonly cache: SiteWiseAssetCache;
  private readonly MAX_RESULTS: number = 250;

  private readonly assetSummaryWorkers: RequestProcessorWorkerGroup<
    AssetSummaryQuery,
    AssetSummary
  > = new RequestProcessorWorkerGroup<AssetSummaryQuery, AssetSummary>(
    (query) => this.assetSummaryWorkerFactory(query),
    (query) => query.assetId
  );

  private readonly assetModelWorkers: RequestProcessorWorkerGroup<
    AssetModelQuery,
    DescribeAssetModelResponse
  > = new RequestProcessorWorkerGroup<
    AssetModelQuery,
    DescribeAssetModelResponse
  >(
    (query) => this.assetModelWorkerFactory(query),
    (query) => query.assetModelId
  );

  private readonly assetPropertyValueWorkers: RequestProcessorWorkerGroup<
    AssetPropertyValueQuery,
    AssetPropertyValue
  > = new RequestProcessorWorkerGroup<
    AssetPropertyValueQuery,
    AssetPropertyValue
  >(
    (query) => this.assetPropertyValueWorkerFactory(query),
    (query) => query.assetId + ':' + query.propertyId
  );

  private readonly hierarchyWorkers: RequestProcessorWorkerGroup<
    AssetHierarchyQuery,
    HierarchyAssetSummaryList
  > = new RequestProcessorWorkerGroup<
    AssetHierarchyQuery,
    HierarchyAssetSummaryList
  >(
    (query) => this.loadHierarchyWorkerFactory(query),
    (query) => assetHierarchyQueryKey(query)
  );

  constructor(api: SiteWiseAssetDataSource, cache: SiteWiseAssetCache) {
    this.api = api;
    this.cache = cache;
  }

  getAssetSummary(
    assetSummaryRequest: AssetSummaryQuery,
    observer: Subscriber<AssetSummary>
  ) {
    this.assetSummaryWorkers.subscribe(assetSummaryRequest, observer);
  }

  async describeModeledDataStream(input: {
    assetPropertyId: string;
    assetId: string;
    assetModelId: string;
  }) {
    return this.api.describeModeledDataStream(input);
  }

  getAssetPropertyValue(
    assetPropertyValueQuery: AssetPropertyValueQuery,
    observer: Subscriber<AssetPropertyValue>
  ) {
    this.assetPropertyValueWorkers.subscribe(assetPropertyValueQuery, observer);
  }

  getAssetModel(
    assetModelRequest: AssetModelQuery,
    observer: Subscriber<DescribeAssetModelResponse>
  ) {
    this.assetModelWorkers.subscribe(assetModelRequest, observer);
  }

  public getAssetHierarchy(
    query: AssetHierarchyQuery,
    observer: Subscriber<HierarchyAssetSummaryList>
  ) {
    const cachedValue = this.hierarchyFromCache(query);
    if (cachedValue && cachedValue.loadingState === 'LOADED') {
      return observer.next(cachedValue);
    }

    this.hierarchyWorkers.subscribe(query, observer);
  }

  startSession() {
    return new SiteWiseAssetSession(this);
  }

  private assetSummaryWorkerFactory(
    assetSummaryQuery: AssetSummaryQuery
  ): Observable<AssetSummary> {
    return new Observable<AssetSummary>((observer) => {
      const assetSummary = this.cache.getAssetSummary(
        assetSummaryQuery.assetId
      );
      if (assetSummary != undefined) {
        observer.next(assetSummary);
        observer.complete();
        return;
      }

      this.api
        .describeAsset({ assetId: assetSummaryQuery.assetId })
        .then((assetSummary) => {
          this.cache.storeAssetSummary(assetSummary);
          observer.next(this.cache.getAssetSummary(assetSummaryQuery.assetId));
          observer.complete();
        })
        .catch((err) => {
          observer.error({
            msg: err.message,
            type: err.name,
            status: err.$metadata?.httpStatusCode,
          });
        });
    });
  }

  private assetPropertyValueWorkerFactory(
    assetPropertyValueQuery: AssetPropertyValueQuery
  ): Observable<AssetPropertyValue> {
    return new Observable<AssetPropertyValue>((observer) => {
      const propertyValue = this.cache.getPropertyValue(
        assetPropertyValueQuery.assetId,
        assetPropertyValueQuery.propertyId
      );
      if (propertyValue != undefined) {
        observer.next(propertyValue);
        observer.complete();
        return;
      }

      this.api
        .getPropertyValue({
          assetId: assetPropertyValueQuery.assetId,
          propertyId: assetPropertyValueQuery.propertyId,
        })
        .then((propertyValue) => {
          if (propertyValue.propertyValue != undefined) {
            this.cache.storePropertyValue(
              assetPropertyValueQuery.assetId,
              assetPropertyValueQuery.propertyId,
              propertyValue.propertyValue
            );
            observer.next(
              this.cache.getPropertyValue(
                assetPropertyValueQuery.assetId,
                assetPropertyValueQuery.propertyId
              )
            );
            observer.complete();
          }
        })
        .catch((err) => {
          observer.error({
            msg: err.message,
            type: err.name,
            status: err.$metadata?.httpStatusCode,
          });
        });
    });
  }

  private assetModelWorkerFactory(
    assetModelQuery: AssetModelQuery
  ): Observable<DescribeAssetModelResponse> {
    return new Observable<DescribeAssetModelResponse>((observer) => {
      const model = this.cache.getAssetModel(assetModelQuery.assetModelId);
      if (model != undefined) {
        observer.next(model);
        observer.complete();
        return;
      }

      this.api
        .describeAssetModel({ assetModelId: assetModelQuery.assetModelId })
        .then((model) => {
          this.cache.storeAssetModel(model);
          observer.next(this.cache.getAssetModel(assetModelQuery.assetModelId));
          observer.complete();
        })
        .catch((err) => {
          observer.error({
            msg: err.message,
            type: err.name,
            status: err.$metadata?.httpStatusCode,
          });
        });
    });
  }

  private buildAssetSummaryList(
    hierarchyId: string,
    cachedValue: CachedAssetSummaryBlock
  ): HierarchyAssetSummaryList {
    return {
      assetHierarchyId: hierarchyId,
      assets: cachedValue.assetIds.map(
        (assetId) => this.cache.getAssetSummary(assetId) as AssetSummary
      ),
      loadingState: cachedValue.loadingStage,
    };
  }

  private hierarchyFromCache(hierarchyRequest: AssetHierarchyQuery) {
    // make sure something is in the cache for this hierarchyId:
    let cachedValue = this.cache.getHierarchy(
      assetHierarchyQueryKey(hierarchyRequest)
    );
    if (!cachedValue) {
      this.cache.setHierarchyLoadingState(
        assetHierarchyQueryKey(hierarchyRequest),
        'NOT_LOADED'
      );
      cachedValue = this.cache.getHierarchy(
        assetHierarchyQueryKey(hierarchyRequest)
      ) as CachedAssetSummaryBlock;
    }
    return this.buildAssetSummaryList(
      hierarchyRequest.assetHierarchyId,
      cachedValue
    );
  }

  private hierarchyRootRequest(
    paginationToken: string | undefined
  ): Observable<ListAssetsCommandOutput> {
    return new Observable<ListAssetsCommandOutput>((observer) => {
      this.api
        .listAssets({
          filter: ListAssetsFilter.TOP_LEVEL,
          maxResults: this.MAX_RESULTS,
          nextToken: paginationToken,
          assetModelId: undefined,
        })
        .then((result) => {
          observer.next(result);
        })
        .catch((err) => {
          observer.error({
            msg: err.message,
            type: err.name,
            status: err.$metadata?.httpStatusCode,
          });
        });
    });
  }

  private hierarchyBranchRequest(
    query: AssetHierarchyQuery,
    paginationToken: string | undefined
  ): Observable<ListAssociatedAssetsCommandOutput> {
    return new Observable<ListAssociatedAssetsCommandOutput>((observer) => {
      this.api
        .listAssociatedAssets({
          hierarchyId: query.assetHierarchyId,
          maxResults: this.MAX_RESULTS,
          traversalDirection: TraversalDirection.CHILD,
          assetId: query.assetId,
          nextToken: paginationToken,
        })
        .then((result) => {
          observer.next(result);
        })
        .catch((err) => {
          observer.error({
            msg: err.message,
            type: err.name,
            status: err.$metadata?.httpStatusCode,
          });
        });
    });
  }

  private cacheHierarchyUpdate(
    query: AssetHierarchyQuery,
    results: ListAssetsCommandOutput | ListAssociatedAssetsCommandOutput
  ): HierarchyAssetSummaryList {
    const hasMoreResults = !!results.nextToken;
    this.cache.appendHierarchyResults(
      assetHierarchyQueryKey(query),
      results.assetSummaries,
      hasMoreResults ? 'LOADING' : 'LOADED',
      results.nextToken
    );
    return this.hierarchyFromCache(query);
  }

  private loadHierarchyWorkerFactory(
    query: AssetHierarchyQuery
  ): Observable<HierarchyAssetSummaryList> {
    const abort = false;
    const cachedValue = this.cache.getHierarchy(
      assetHierarchyQueryKey(query)
    ) as CachedAssetSummaryBlock;

    if (query.assetHierarchyId !== HIERARCHY_ROOT_ID && !query.assetId) {
      throw 'Queries for children require a parent AssetId';
    }

    return new Observable<HierarchyAssetSummaryList>((observer) => {
      let observable: Observable<HierarchyAssetSummaryList>;
      if (query.assetHierarchyId === HIERARCHY_ROOT_ID) {
        observable = this.hierarchyRootRequest(
          cachedValue.paginationToken
        ).pipe(
          expand((result: ListAssetsCommandOutput) => {
            return !abort && result.nextToken
              ? this.hierarchyRootRequest(cachedValue.paginationToken)
              : EMPTY;
          }),
          map<ListAssetsCommandOutput, HierarchyAssetSummaryList>((value) => {
            return this.cacheHierarchyUpdate(query, value);
          })
        );
      } else {
        observable = this.hierarchyBranchRequest(
          query,
          cachedValue.paginationToken
        ).pipe(
          expand((result: ListAssociatedAssetsCommandOutput) => {
            return !abort && result.nextToken
              ? this.hierarchyBranchRequest(query, cachedValue.paginationToken)
              : EMPTY;
          }),
          map<ListAssociatedAssetsCommandOutput, HierarchyAssetSummaryList>(
            (value) => {
              return this.cacheHierarchyUpdate(query, value);
            }
          )
        );
      }

      observable.subscribe({
        next: (results) => {
          if (results) {
            observer.next(results);
          }
          if (results && results.loadingState === 'LOADED') {
            observer.complete();
          }
        },
        error: (err) => {
          this.cache.storeErrors(err);
          const errors = this.cache.getAllErrors();
          observer.error(errors);
        },
      });

      return () => {
        // TODO: check if this is required
        observer.unsubscribe();
        // if the unsubscribe aborts an ongoing request chain set the state to PAUSED
        // TODO: check for a race condition where this happens first and then a result returns from a request, clobbering the PAUSED value
        if (cachedValue.loadingStage !== 'LOADED') {
          this.cache.setHierarchyLoadingState(query.assetHierarchyId, 'PAUSED');
        }
      };
    });
  }
}
