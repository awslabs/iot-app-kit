import { assetHierarchyQueryKey, HIERARCHY_ROOT_ID } from './sitewise/types';
import { lastValueFrom, Observable, type Subscription } from 'rxjs';
import type {
  AssetHierarchyQuery,
  HierarchyAssetSummaryList,
  SiteWiseAssetModuleInterface,
  SiteWiseAssetSessionInterface,
} from './sitewise/types';
import type {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetModelResponse,
} from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails } from '@iot-app-kit/core';

export class MockSiteWiseAssetsReplayData {
  public models: Map<string, DescribeAssetModelResponse> = new Map<
    string,
    DescribeAssetModelResponse
  >();
  public hierarchies: Map<string, HierarchyAssetSummaryList> = new Map<
    string,
    HierarchyAssetSummaryList
  >();
  public properties: Map<string, AssetPropertyValue> = new Map<
    string,
    AssetPropertyValue
  >();
  public assets: Map<string, AssetSummary> = new Map<string, AssetSummary>();
  public errors: ErrorDetails[] = [];

  public addAssetModels(newModels: DescribeAssetModelResponse[]) {
    newModels.forEach((model) =>
      this.models.set(model.assetModelId as string, model)
    );
  }

  public addAssetSummaries(newAssetSummaries: AssetSummary[]) {
    newAssetSummaries.forEach((summary) =>
      this.assets.set(summary.id as string, summary)
    );
  }

  public addAssetPropertyValues(propertyValue: {
    assetId: string;
    propertyId: string;
    value: AssetPropertyValue;
  }) {
    this.properties.set(
      propertyValue.assetId + ':' + propertyValue.propertyId,
      propertyValue.value
    );
  }

  public addHierarchyAssetSummaryList(
    query: AssetHierarchyQuery,
    newHierarchyAssetSummaryList: HierarchyAssetSummaryList
  ) {
    this.hierarchies.set(
      assetHierarchyQueryKey(query),
      newHierarchyAssetSummaryList
    );
  }

  public addErrors(errors: ErrorDetails[]) {
    this.errors = [...this.errors, ...errors];
  }
}

export class MockSiteWiseAssetSession implements SiteWiseAssetSessionInterface {
  private readonly replayData: MockSiteWiseAssetsReplayData;

  constructor(replayData: MockSiteWiseAssetsReplayData) {
    this.replayData = replayData;
  }

  private _requestAssetSummary(query: {
    assetId: string;
  }): Observable<AssetSummary> {
    return new Observable<AssetSummary>((observer) => {
      if (this.replayData.errors.length > 0) {
        observer.error(this.replayData.errors);
      } else {
        observer.next(this.replayData.assets.get(query.assetId));
      }
    });
  }
  requestAssetSummary(
    query: { assetId: string },
    observer: {
      next: (assetSummary: AssetSummary) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetSummary(query).subscribe(observer);
  }
  fetchAssetSummary(query: { assetId: string }): Promise<AssetSummary> {
    return lastValueFrom(this._requestAssetSummary(query));
  }

  _requestAssetModel(query: {
    assetModelId: string;
  }): Observable<DescribeAssetModelResponse> {
    return new Observable<DescribeAssetModelResponse>((observer) => {
      observer.next(this.replayData.models.get(query.assetModelId));
    });
  }
  requestAssetModel(
    query: { assetModelId: string },
    observer: {
      next: (assetSummary: DescribeAssetModelResponse) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetModel(query).subscribe(observer);
  }
  fetchAssetModel(query: {
    assetModelId: string;
  }): Promise<DescribeAssetModelResponse> {
    return lastValueFrom(this._requestAssetModel(query));
  }

  _requestAssetPropertyValue(query: {
    assetId: string;
    propertyId: string;
  }): Observable<AssetPropertyValue> {
    return new Observable<AssetPropertyValue>((observer) => {
      observer.next(
        this.replayData.properties.get(query.assetId + ':' + query.propertyId)
      );
    });
  }
  requestAssetPropertyValue(
    query: { assetId: string; propertyId: string },
    observer: {
      next: (assetSummary: AssetPropertyValue) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetPropertyValue(query).subscribe(observer);
  }
  fetchAssetPropertyValue(query: {
    assetId: string;
    propertyId: string;
  }): Promise<AssetPropertyValue> {
    return lastValueFrom(this._requestAssetPropertyValue(query));
  }

  _requestAssetHierarchy(query: {
    assetId?: string | undefined;
    assetHierarchyId: string;
  }): Observable<HierarchyAssetSummaryList> {
    return new Observable<HierarchyAssetSummaryList>((observer) => {
      if (this.replayData.errors.length > 0) {
        observer.error(this.replayData.errors);
      } else {
        observer.next(
          this.replayData.hierarchies.get(assetHierarchyQueryKey(query))
        );
      }
    });
  }
  requestAssetHierarchy(
    query: { assetId?: string | undefined; assetHierarchyId: string },
    observer: {
      next: (assetSummary: HierarchyAssetSummaryList) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription {
    return this._requestAssetHierarchy(query).subscribe(observer);
  }
  fetchAssetHierarchy(query: {
    assetId?: string | undefined;
    assetHierarchyId: string;
  }): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestAssetHierarchy(query));
  }

  _requestRootAssets(): Observable<HierarchyAssetSummaryList> {
    return new Observable<HierarchyAssetSummaryList>((observer) => {
      if (this.replayData.errors.length > 0) {
        observer.error(this.replayData.errors);
      } else {
        observer.next(
          this.replayData.hierarchies.get(
            assetHierarchyQueryKey({ assetHierarchyId: HIERARCHY_ROOT_ID })
          )
        );
      }
    });
  }
  requestRootAssets(observer: {
    next: (assetSummary: HierarchyAssetSummaryList) => void;
    error?: (err: ErrorDetails[]) => void;
  }): Subscription {
    return this._requestRootAssets().subscribe(observer);
  }
  fetchRootAssets(): Promise<HierarchyAssetSummaryList> {
    return lastValueFrom(this._requestRootAssets());
  }

  close(): void {}
}

export class MockSiteWiseAssetModule implements SiteWiseAssetModuleInterface {
  private readonly replayData: MockSiteWiseAssetsReplayData;

  constructor(replayData: MockSiteWiseAssetsReplayData) {
    this.replayData = replayData;
  }

  startSession(): SiteWiseAssetSessionInterface {
    return new MockSiteWiseAssetSession(this.replayData);
  }
}
