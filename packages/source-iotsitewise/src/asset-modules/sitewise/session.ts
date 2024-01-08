import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { HIERARCHY_ROOT_ID } from './types';
import { RequestProcessor } from './requestProcessor';
import type {
  AssetHierarchyQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetSummaryQuery,
  HierarchyAssetSummaryList,
  SiteWiseAssetSessionInterface,
} from './types';
import type {
  AssetSummary,
  DescribeAssetModelResponse,
  AssetPropertyValue,
} from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails } from '@iot-app-kit/core';

export class SiteWiseAssetSession implements SiteWiseAssetSessionInterface {
  private processor: RequestProcessor;

  constructor(processor: RequestProcessor) {
    this.processor = processor;
  }

  private _requestAssetSummary(
    query: AssetSummaryQuery
  ): Observable<AssetSummary> {
    return new Observable<AssetSummary>((observer) => {
      this.processor.getAssetSummary(query, observer);
    });
  }

  private _requestAssetModel(
    query: AssetModelQuery
  ): Observable<DescribeAssetModelResponse> {
    return new Observable<DescribeAssetModelResponse>((observer) => {
      this.processor.getAssetModel(query, observer);
    });
  }

  private _requestAssetPropertyValue(
    query: AssetPropertyValueQuery
  ): Observable<AssetPropertyValue> {
    return new Observable<AssetPropertyValue>((observer) => {
      this.processor.getAssetPropertyValue(query, observer);
    });
  }

  private _requestRootAssets(): Observable<HierarchyAssetSummaryList> {
    return new Observable<HierarchyAssetSummaryList>((observer) => {
      const query: AssetHierarchyQuery = {
        assetHierarchyId: HIERARCHY_ROOT_ID,
      };
      this.processor.getAssetHierarchy(query, observer);
    });
  }

  private _requestAssetHierarchy(
    query: AssetHierarchyQuery
  ): Observable<HierarchyAssetSummaryList> {
    return new Observable<HierarchyAssetSummaryList>((observer) => {
      this.processor.getAssetHierarchy(query, observer);
    });
  }

  fetchAssetHierarchy(
    query: AssetHierarchyQuery
  ): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestAssetHierarchy(query));
  }

  fetchAssetModel(query: AssetModelQuery): Promise<DescribeAssetModelResponse> {
    return lastValueFrom(this._requestAssetModel(query));
  }

  fetchAssetPropertyValue(
    query: AssetPropertyValueQuery
  ): Promise<AssetPropertyValue> {
    return lastValueFrom(this._requestAssetPropertyValue(query));
  }

  fetchAssetSummary(query: AssetSummaryQuery): Promise<AssetSummary> {
    return lastValueFrom(this._requestAssetSummary(query));
  }

  fetchRootAssets(): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestRootAssets());
  }

  async describeModeledDataStream(input: {
    assetPropertyId: string;
    assetId: string;
    assetModelId: string;
  }) {
    return this.processor.describeModeledDataStream(input);
  }

  requestAssetHierarchy(
    query: AssetHierarchyQuery,
    observer: {
      next: (assetSummary: HierarchyAssetSummaryList) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetHierarchy(query).subscribe(observer);
  }

  requestAssetModel(
    query: AssetModelQuery,
    observer: {
      next: (assetSummary: DescribeAssetModelResponse) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetModel(query).subscribe(observer);
  }

  requestAssetPropertyValue(
    query: AssetPropertyValueQuery,
    observer: {
      next: (assetSummary: AssetPropertyValue) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetPropertyValue(query).subscribe(observer);
  }

  requestAssetSummary(
    query: AssetSummaryQuery,
    observer: {
      next: (assetSummary: AssetSummary) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetSummary(query).subscribe(observer);
  }

  requestRootAssets(observer: {
    next: (assetSummary: HierarchyAssetSummaryList) => void;
    error?: (err: ErrorDetails[]) => void;
  }): Subscription {
    return this._requestRootAssets().subscribe(observer);
  }

  /**
   * Close the session, causes all requests to be terminated
   */
  close() {
    // complete all observables in the request queue
  }
}
