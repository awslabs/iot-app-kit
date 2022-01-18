import {
  AssetHierarchyQuery,
  assetHierarchyQueryKey,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetSummaryQuery,
  CachedAssetSummaryBlock,
  HIERARCHY_ROOT_ID,
  HierarchyAssetSummaryList,
  LoadingStateEnum,
} from './types';
import { EMPTY, Observable, Subscriber } from 'rxjs';
import {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetModelResponse,
  ListAssetsCommandOutput,
  ListAssetsFilter,
  ListAssociatedAssetsCommandOutput,
  TraversalDirection,
} from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetCache } from './cache';
import { SiteWiseAssetSession } from './session';
import { RequestProcessorWorkerGroup } from './requestProcessorWorkerGroup';
import { expand, map } from 'rxjs/operators';
import { SiteWiseAssetDataSource } from '../../data-module/types';

export class RequestProcessor {
  private readonly api: SiteWiseAssetDataSource;
  private readonly cache: SiteWiseAssetCache;
  private readonly MAX_RESULTS: number = 250;

  private readonly assetSummaryWorkers: RequestProcessorWorkerGroup<AssetSummaryQuery, AssetSummary> =
    new RequestProcessorWorkerGroup<AssetSummaryQuery, AssetSummary>(
      (query) => this.assetSummaryWorkerFactory(query),
      (query) => query.assetId
    );

  private readonly assetModelWorkers: RequestProcessorWorkerGroup<AssetModelQuery, DescribeAssetModelResponse> =
    new RequestProcessorWorkerGroup<AssetModelQuery, DescribeAssetModelResponse>(
      (query) => this.assetModelWorkerFactory(query),
      (query) => query.assetModelId
    );

  private readonly assetPropertyValueWorkers: RequestProcessorWorkerGroup<AssetPropertyValueQuery, AssetPropertyValue> =
    new RequestProcessorWorkerGroup<AssetPropertyValueQuery, AssetPropertyValue>(
      (query) => this.assetPropertyValueWorkerFactory(query),
      (query) => query.assetId + ':' + query.propertyId
    );

  private readonly hierarchyWorkers: RequestProcessorWorkerGroup<AssetHierarchyQuery, HierarchyAssetSummaryList> =
    new RequestProcessorWorkerGroup<AssetHierarchyQuery, HierarchyAssetSummaryList>(
      (query) => this.loadHierarchyWorkerFactory(query),
      (query) => assetHierarchyQueryKey(query)
    );

  constructor(api: SiteWiseAssetDataSource, cache: SiteWiseAssetCache) {
    this.api = api;
    this.cache = cache;
  }

  private assetSummaryWorkerFactory(assetSummaryQuery: AssetSummaryQuery): Observable<AssetSummary> {
    return new Observable<AssetSummary>((observer) => {
      let assetSummary = this.cache.getAssetSummary(assetSummaryQuery.assetId);
      if (assetSummary != undefined) {
        observer.next(assetSummary);
        observer.complete();
        return;
      }

      this.api.describeAsset({ assetId: assetSummaryQuery.assetId }).then((assetSummary) => {
        this.cache.storeAssetSummary(assetSummary);
        observer.next(this.cache.getAssetSummary(assetSummaryQuery.assetId));
        observer.complete();
      });
    });
  }

  getAssetSummary(assetSummaryRequest: AssetSummaryQuery, observer: Subscriber<AssetSummary>) {
    this.assetSummaryWorkers.subscribe(assetSummaryRequest, observer);
  }

  private assetPropertyValueWorkerFactory(
    assetPropertyValueQuery: AssetPropertyValueQuery
  ): Observable<AssetPropertyValue> {
    return new Observable<AssetPropertyValue>((observer) => {
      let propertyValue = this.cache.getPropertyValue(
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
              this.cache.getPropertyValue(assetPropertyValueQuery.assetId, assetPropertyValueQuery.propertyId)
            );
            observer.complete();
          }
        });
    });
  }

  getAssetPropertyValue(assetPropertyValueQuery: AssetPropertyValueQuery, observer: Subscriber<AssetPropertyValue>) {
    this.assetPropertyValueWorkers.subscribe(assetPropertyValueQuery, observer);
  }

  private assetModelWorkerFactory(assetModelQuery: AssetModelQuery): Observable<DescribeAssetModelResponse> {
    return new Observable<DescribeAssetModelResponse>((observer) => {
      let model = this.cache.getAssetModel(assetModelQuery.assetModelId);
      if (model != undefined) {
        observer.next(model);
        observer.complete();
        return;
      }

      this.api.describeAssetModel({ assetModelId: assetModelQuery.assetModelId }).then((model) => {
        this.cache.storeAssetModel(model);
        observer.next(this.cache.getAssetModel(assetModelQuery.assetModelId));
        observer.complete();
      });
    });
  }

  getAssetModel(assetModelRequest: AssetModelQuery, observer: Subscriber<DescribeAssetModelResponse>) {
    this.assetModelWorkers.subscribe(assetModelRequest, observer);
  }

  private buildAssetSummaryList(hierarchyId: string, cachedValue: CachedAssetSummaryBlock): HierarchyAssetSummaryList {
    return {
      assetHierarchyId: hierarchyId,
      assets: cachedValue.assetIds.map((assetId) => this.cache.getAssetSummary(assetId) as AssetSummary),
      loadingState: cachedValue.loadingStage,
    };
  }

  private hierarchyFromCache(hierarchyRequest: AssetHierarchyQuery) {
    // make sure something is in the cache for this hierarchyId:
    let cachedValue = this.cache.getHierarchy(assetHierarchyQueryKey(hierarchyRequest));
    if (!cachedValue) {
      this.cache.setHierarchyLoadingState(assetHierarchyQueryKey(hierarchyRequest), LoadingStateEnum.NOT_LOADED);
      cachedValue = this.cache.getHierarchy(assetHierarchyQueryKey(hierarchyRequest)) as CachedAssetSummaryBlock;
    }
    return this.buildAssetSummaryList(hierarchyRequest.assetHierarchyId, cachedValue);
  }

  private hierarchyRootRequest(paginationToken: string | undefined): Observable<ListAssetsCommandOutput> {
    return new Observable<ListAssetsCommandOutput>((observer) => {
      this.api
        .listAssets({
          filter: ListAssetsFilter.TOP_LEVEL,
          maxResults: this.MAX_RESULTS,
          nextToken: paginationToken,
          assetModelId: undefined,
        })
        .then((result) => observer.next(result));
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
      hasMoreResults ? LoadingStateEnum.LOADING : LoadingStateEnum.LOADED,
      results.nextToken
    );
    return this.hierarchyFromCache(query);
  }

  private loadHierarchyWorkerFactory(query: AssetHierarchyQuery): Observable<HierarchyAssetSummaryList> {
    let abort = false;
    let cachedValue = this.cache.getHierarchy(assetHierarchyQueryKey(query)) as CachedAssetSummaryBlock;

    if (query.assetHierarchyId !== HIERARCHY_ROOT_ID && !query.assetId) {
      throw 'Queries for children require a parent AssetId';
    }

    return new Observable<HierarchyAssetSummaryList>((observer) => {
      let observable: Observable<HierarchyAssetSummaryList>;
      if (query.assetHierarchyId === HIERARCHY_ROOT_ID) {
        observable = this.hierarchyRootRequest(cachedValue.paginationToken).pipe(
          expand((result: ListAssetsCommandOutput) => {
            return !abort && result.nextToken ? this.hierarchyRootRequest(cachedValue.paginationToken) : EMPTY;
          }),
          map<ListAssetsCommandOutput, HierarchyAssetSummaryList>((value) => {
            return this.cacheHierarchyUpdate(query, value);
          })
        );
      } else {
        observable = this.hierarchyBranchRequest(query, cachedValue.paginationToken).pipe(
          expand((result: ListAssociatedAssetsCommandOutput) => {
            return !abort && result.nextToken ? this.hierarchyBranchRequest(query, cachedValue.paginationToken) : EMPTY;
          }),
          map<ListAssociatedAssetsCommandOutput, HierarchyAssetSummaryList>((value) => {
            return this.cacheHierarchyUpdate(query, value);
          })
        );
      }

      observable.subscribe((results) => {
        if (results) {
          observer.next(results);
        }
        if (results && results.loadingState === LoadingStateEnum.LOADED) {
          observer.complete();
        }
      });

      return () => {
        // TODO: check if this is required
        observer.unsubscribe();
        // if the unsubscribe aborts an ongoing request chain set the state to PAUSED
        // TODO: check for a race condition where this happens first and then a result returns from a request, clobbering the PAUSED value
        if (cachedValue.loadingStage !== LoadingStateEnum.LOADED) {
          this.cache.setHierarchyLoadingState(query.assetHierarchyId, LoadingStateEnum.PAUSED);
        }
      };
    });
  }

  public getAssetHierarchy(query: AssetHierarchyQuery, observer: Subscriber<HierarchyAssetSummaryList>) {
    const cachedValue = this.hierarchyFromCache(query);
    if (cachedValue && cachedValue.loadingState === LoadingStateEnum.LOADED) {
      return cachedValue;
    }

    this.hierarchyWorkers.subscribe(query, observer);
  }

  startSession() {
    return new SiteWiseAssetSession(this);
  }
}
