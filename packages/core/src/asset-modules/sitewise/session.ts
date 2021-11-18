import { Observable, Subscription } from 'rxjs';
import { AssetHierarchyQuery, AssetModelQuery, AssetPropertyValueQuery, AssetQuery, AssetSummaryQuery } from './types';
import { AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise/dist-types';
import { RequestProcessor } from './requestProcessor';
import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';

type QueueEntry =  {query: AssetQuery, observable: Observable<any>};

export class SiteWiseAssetSession {
  private processor: RequestProcessor;
  private requestQueue: QueueEntry[] = [];

  constructor(processor: RequestProcessor) {
    this.processor = processor;
  }

  public addRequest(query: AssetSummaryQuery, observer: (assetSummary: AssetSummary) => void): Subscription;
  public addRequest(query: AssetPropertyValueQuery, observer: (assetPropertyValue: AssetPropertyValue) => void): Subscription;
  public addRequest(query: AssetModelQuery, observer: (assetModel: DescribeAssetModelResponse) => void): Subscription;
  public addRequest(query: AssetHierarchyQuery, observer: (assetSummary: AssetSummary[]) => void): Subscription;
  public addRequest(queryAny: any, observerAny:  (consumedType: any) => void): Subscription {
    let observable: Observable<any>;
    if ('assetModelId' in queryAny) {
      observable = new Observable<DescribeAssetModelResponse>(observer => {
        this.processor.getAssetModel(queryAny, observer);
      });
    } else if ('propertyId' in queryAny) {
      observable = new Observable<AssetPropertyValue>(observer => {
        this.processor.getAssetPropertyValue(queryAny, observer);
      });
    } else if (`assetHierarchyId` in queryAny) {
      throw "NotImplementedException"
    } else if (`assetId` in queryAny) {
      observable = new Observable<AssetSummary>(observer => {
        this.processor.getAssetSummary(queryAny, observer);
      });
    } else {
      throw "Unexpected request type: the type of the request object could not be determined"
    }

    this.requestQueue.push({query: queryAny, observable: observable});
    return observable.subscribe(observerAny);
  }

  /**
   * Close the session, causes all requests to be terminated
   */
  close() {
    // complete all observables in the request queue
  }
}
