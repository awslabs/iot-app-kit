import { Observable, Subscription } from 'rxjs';
import {
  AssetHierarchyQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetQuery,
  AssetSummaryQuery,
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

  /**
   * Close the session, causes all requests to be terminated
   */
  close() {
    // complete all observables in the request queue
  }
}
