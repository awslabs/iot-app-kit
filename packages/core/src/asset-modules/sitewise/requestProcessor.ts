import {
  AssetHierarchyQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetSummaryQuery,
  CachedAssetSummaryBlock,
  HIERARCHY_ROOT_ID,
  HierarchyAssetSummaryList,
  LoadingStateEnum
} from './types';
import { EMPTY, Observable, Subscriber } from 'rxjs';
import {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetCommand,
  DescribeAssetModelCommand,
  DescribeAssetModelResponse,
  GetAssetPropertyValueCommand,
  IoTSiteWiseClient,
  ListAssetsCommand,
  ListAssetsCommandOutput,
  ListAssetsFilter,
  ListAssociatedAssetsCommand,
  ListAssociatedAssetsCommandOutput,
  TraversalDirection
} from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetCache } from './cache';
import { SiteWiseAssetSession } from './session';
import { RequestProcessorWorkerGroup } from './requestProcessorWorkerGroup';
import { expand, map } from 'rxjs/operators';

export class RequestProcessor {
  private readonly api: IoTSiteWiseClient;
  private readonly cache: SiteWiseAssetCache;
  private readonly MAX_RESULTS: number = 250;
  private readonly hierarchyWorkers: RequestProcessorWorkerGroup<AssetHierarchyQuery, HierarchyAssetSummaryList> =
    new RequestProcessorWorkerGroup<AssetHierarchyQuery, HierarchyAssetSummaryList>(
      query => this.loadHierarchyWorkerFactory(query),
      query => query.assetHierarchyId,
      query => this.hierarchyFromCache(query),
    );

  constructor(api: IoTSiteWiseClient, cache: SiteWiseAssetCache) {
    this.api = api;
    this.cache = cache;
  }

  getAssetSummary(assetSummaryRequest: AssetSummaryQuery, observer: Subscriber<AssetSummary>) {
    let assetSummary = this.cache.getAssetSummary(assetSummaryRequest.assetId);
    if (assetSummary != undefined) {
      observer.next(assetSummary);
      observer.complete();
      return;
    }

    this.api.send(new DescribeAssetCommand({ assetId: assetSummaryRequest.assetId })).then((assetSummary) => {
      this.cache.storeAssetSummary(assetSummary);
      observer.next(this.cache.getAssetSummary(assetSummaryRequest.assetId));
      observer.complete();
    });
  }

  getAssetPropertyValue(assetPropertyValueRequest: AssetPropertyValueQuery, observer: Subscriber<AssetPropertyValue>) {
    let propertyValue = this.cache.getPropertyValue(
      assetPropertyValueRequest.assetId,
      assetPropertyValueRequest.propertyId
    );
    if (propertyValue != undefined) {
      observer.next(propertyValue);
      observer.complete();
      return;
    }

    this.api
      .send(
        new GetAssetPropertyValueCommand({
          assetId: assetPropertyValueRequest.assetId,
          propertyId: assetPropertyValueRequest.propertyId,
        })
      )
      .then((propertyValue) => {
        if (propertyValue.propertyValue != undefined) {
          this.cache.storePropertyValue(
            assetPropertyValueRequest.assetId,
            assetPropertyValueRequest.propertyId,
            propertyValue.propertyValue
          );
          observer.next(
            this.cache.getPropertyValue(assetPropertyValueRequest.assetId, assetPropertyValueRequest.propertyId)
          );
          observer.complete();
        }
        // TODO: if it is undefined, perform error handling
      });
  }

  getAssetModel(assetModelRequest: AssetModelQuery, observer: Subscriber<DescribeAssetModelResponse>) {
    let model = this.cache.getAssetModel(assetModelRequest.assetModelId);
    if (model != undefined) {
      observer.next(model);
      observer.complete();
      return;
    }

    this.api.send(new DescribeAssetModelCommand({ assetModelId: assetModelRequest.assetModelId })).then((model) => {
      this.cache.storeAssetModel(model);
      observer.next(this.cache.getAssetModel(assetModelRequest.assetModelId));
      observer.complete();
    });
  }

  private buildAssetSummaryList(hierarchyId: string, cachedValue: CachedAssetSummaryBlock): HierarchyAssetSummaryList {
    return {
      assetHierarchyId: hierarchyId,
      assets: cachedValue.assetIds.map(assetId => this.cache.getAssetSummary(assetId) as AssetSummary),
      loadingState: cachedValue.loadingStage,
    };
  }

  private hierarchyFromCache(hierarchyRequest: AssetHierarchyQuery) {
    // make sure something is in the cache for this hierarchyId:
    let cachedValue = this.cache.getHierarchy(hierarchyRequest.assetHierarchyId);
    if (!cachedValue) {
      this.cache.setHierarchyLoadingState(hierarchyRequest.assetHierarchyId, LoadingStateEnum.NOT_LOADED);
      cachedValue = this.cache.getHierarchy(hierarchyRequest.assetHierarchyId) as CachedAssetSummaryBlock;
    }

    return this.buildAssetSummaryList(hierarchyRequest.assetHierarchyId, cachedValue);
  }

  private hierarchyRootRequest(paginationToken: string|undefined): Observable<ListAssetsCommandOutput>  {
    return new Observable<ListAssetsCommandOutput>(observer => {
      this.api.send(new ListAssetsCommand({
        filter: ListAssetsFilter.TOP_LEVEL,
        maxResults: this.MAX_RESULTS,
        nextToken: paginationToken,
        assetModelId: undefined,
      })).then(result => observer.next(result));
    });
  }

  private hierarchyBranchRequest(query: AssetHierarchyQuery,
                                 paginationToken: string | undefined): Observable<ListAssociatedAssetsCommandOutput> {
    return new Observable<ListAssociatedAssetsCommandOutput>(observer => {
      this.api.send(new ListAssociatedAssetsCommand({
        hierarchyId: query.assetHierarchyId,
        maxResults: this.MAX_RESULTS,
        traversalDirection: TraversalDirection.CHILD,
        assetId: query.assetId,
        nextToken: paginationToken,
      })).then(result => observer.next(result));
    });
  }

  private cacheHierarchyUpdate(query: AssetHierarchyQuery,
                               results: ListAssetsCommandOutput | ListAssociatedAssetsCommandOutput)
    : HierarchyAssetSummaryList {
    const hasMoreResults = !!results.nextToken;
    this.cache.appendHierarchyResults(query.assetHierarchyId,
      results.assetSummaries,
      hasMoreResults ? LoadingStateEnum.LOADING : LoadingStateEnum.LOADED,
      results.nextToken);
    return this.hierarchyFromCache(query);
  }

  private loadHierarchyWorkerFactory(query: AssetHierarchyQuery): Observable<HierarchyAssetSummaryList> {
    let abort = false;
    let cachedValue = this.cache.getHierarchy(query.assetHierarchyId) as CachedAssetSummaryBlock;

    if (query.assetHierarchyId !== HIERARCHY_ROOT_ID && !query.assetId) {
      throw "Queries for children require a parent AssetId";
    }

    let expandCount: number = 0;

    return new Observable<HierarchyAssetSummaryList>(observer => {
      let observable: Observable<HierarchyAssetSummaryList>;
      if (query.assetHierarchyId === HIERARCHY_ROOT_ID) {
        observable = this.hierarchyRootRequest(cachedValue.paginationToken).pipe(
          expand((result: ListAssetsCommandOutput) => {
            console.log("expand count:", expandCount++, " Will stop?");
            return (!abort && result.nextToken) ? this.hierarchyRootRequest(cachedValue.paginationToken) : EMPTY;
          }),
          map<ListAssetsCommandOutput, HierarchyAssetSummaryList>(value => {
            return this.cacheHierarchyUpdate(query, value);
          }));
      } else {
        observable = this.hierarchyBranchRequest(query, cachedValue.paginationToken).pipe(
          expand((result: ListAssociatedAssetsCommandOutput) => {

            return (!abort && result.nextToken) ?
              this.hierarchyBranchRequest(query, cachedValue.paginationToken) : EMPTY;
          }),
          map<ListAssociatedAssetsCommandOutput, HierarchyAssetSummaryList>(value => {
            return this.cacheHierarchyUpdate(query, value);
          }));
      }

      observable.subscribe(results => {
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
