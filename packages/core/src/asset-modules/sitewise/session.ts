import { firstValueFrom, lastValueFrom, Observable, Subscription } from 'rxjs';
import {
  AssetHierarchyQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetQuery,
  AssetSummaryQuery, HIERARCHY_ROOT_ID,
  HierarchyAssetSummaryList,
  isAssetHierarchyQuery,
  isAssetModelQuery,
  isAssetPropertyValueQuery,
  isAssetSummaryQuery,
  SiteWiseAssetSessionInterface,
} from './types';
import { AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise/dist-types';
import { RequestProcessor } from './requestProcessor';
import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';

type QueueEntry = { query: AssetQuery; observable: Observable<any> };

export class SiteWiseAssetSession implements SiteWiseAssetSessionInterface {
  private processor: RequestProcessor;
  private requestQueue: QueueEntry[] = [];

  constructor(processor: RequestProcessor) {
    this.processor = processor;
  }

  /*
  public addRequest(query: AssetModelQuery, observer: (assetModel: DescribeAssetModelResponse) => void): Subscription;
  public addRequest(
    query: AssetPropertyValueQuery,
    observer: (assetPropertyValue: AssetPropertyValue) => void
  ): Subscription;
  public addRequest(
    query: AssetHierarchyQuery,
    observer: (assetSummary: HierarchyAssetSummaryList) => void
  ): Subscription;
  public addRequest(query: AssetSummaryQuery, observer: (assetSummary: AssetSummary) => void): Subscription;
  public addRequest<Result>(query: AssetQuery, observerAny: (consumedType: Result) => void): Subscription {
    let observable: Observable<any>;
    if (isAssetModelQuery(query)) {
      observable = new Observable<DescribeAssetModelResponse>((observer) => {
        this.processor.getAssetModel(query, observer);
      });
    } else if (isAssetPropertyValueQuery(query)) {
      observable = new Observable<AssetPropertyValue>((observer) => {
        this.processor.getAssetPropertyValue(query, observer);
      });
    } else if (isAssetHierarchyQuery(query)) {
      observable = new Observable<HierarchyAssetSummaryList>((observer) => {
        this.processor.getAssetHierarchy(query, observer);
      });
    } else if (isAssetSummaryQuery(query)) {
      observable = new Observable<AssetSummary>((observer) => {
        this.processor.getAssetSummary(query, observer);
      });
    } else {
      throw 'Unexpected request type: the type of the request object could not be determined';
    }

    this.requestQueue.push({ query: query, observable: observable });
    return observable.subscribe(observerAny);
  }
   */

  /**
   * Close the session, causes all requests to be terminated
   */
  close() {
    // complete all observables in the request queue
  }

  private _requestAssetSummary(query: AssetSummaryQuery): Observable<AssetSummary> {
    const observable: Observable<AssetSummary> = new Observable<AssetSummary>((observer) => {
      this.processor.getAssetSummary(query, observer);
      this.requestQueue.push({ query: query, observable: observable });
    });
    return observable;
  };

  private _requestAssetModel(query: AssetModelQuery): Observable<DescribeAssetModelResponse> {
    const observable: Observable<DescribeAssetModelResponse> =
        new Observable<DescribeAssetModelResponse>((observer) => {
      this.processor.getAssetModel(query, observer);
      this.requestQueue.push({ query: query, observable: observable });
    });
    return observable;
  }

  private _requestAssetPropertyValue(query: AssetPropertyValueQuery): Observable<AssetPropertyValue> {
    const observable: Observable<AssetPropertyValue> =
      new Observable<AssetPropertyValue>((observer) => {
        this.processor.getAssetPropertyValue(query, observer);
        this.requestQueue.push({ query: query, observable: observable });
      });
    return observable;
  }

  private _requestRootAssets():  Observable<HierarchyAssetSummaryList> {
    const observable: Observable<HierarchyAssetSummaryList> =
      new Observable<HierarchyAssetSummaryList>((observer) => {
        const query: AssetHierarchyQuery = { assetHierarchyId: HIERARCHY_ROOT_ID };
        this.processor.getAssetHierarchy(query, observer);
        this.requestQueue.push({ query: query, observable: observable });
      });
    return observable;
  }

  private _requestAssetHierarchy(query: AssetHierarchyQuery): Observable<HierarchyAssetSummaryList> {
    const observable: Observable<HierarchyAssetSummaryList> =
      new Observable<HierarchyAssetSummaryList>((observer) => {
        this.processor.getAssetHierarchy(query, observer);
        this.requestQueue.push({ query: query, observable: observable });
      });
    return observable;
  }

  fetchAssetHierarchy(query: AssetHierarchyQuery): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestAssetHierarchy(query));
  }

  fetchAssetModel(query: AssetModelQuery): Promise<DescribeAssetModelResponse> {
    return lastValueFrom(this._requestAssetModel(query));
  }

  fetchAssetPropertyValue(query: AssetPropertyValueQuery): Promise<AssetPropertyValue> {
    return lastValueFrom(this._requestAssetPropertyValue(query));
  }

  fetchAssetSummary(query: AssetSummaryQuery): Promise<AssetSummary> {
    return lastValueFrom(this._requestAssetSummary(query));
  }

  fetchRootAssets(): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestRootAssets());
  }

  requestAssetHierarchy(query: AssetHierarchyQuery,
                        observer: (assetSummary: HierarchyAssetSummaryList) => void): Subscription {
    return this._requestAssetHierarchy(query).subscribe(observer);
  }

  requestAssetModel(query: AssetModelQuery, observer: (assetSummary: DescribeAssetModelResponse) => void): Subscription {
    return this._requestAssetModel(query).subscribe(observer);
  }

  requestAssetPropertyValue(query: AssetPropertyValueQuery,
                            observer: (assetSummary: AssetPropertyValue) => void): Subscription {
    return this._requestAssetPropertyValue(query).subscribe(observer);
  }

  requestAssetSummary(query: AssetSummaryQuery, observer: (assetSummary: AssetSummary) => void): Subscription {
    return this._requestAssetSummary(query).subscribe(observer);
  }

  requestRootAssets(observer: (assetSummary: HierarchyAssetSummaryList) => void): Subscription {
    return this._requestRootAssets().subscribe(observer);
  }
}
