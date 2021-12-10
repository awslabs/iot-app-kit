import {
  AssetHierarchyQuery, assetHierarchyQueryKey,
  AssetModelQuery,
  AssetPropertyValueQuery,
  AssetSummaryQuery,
  HierarchyAssetSummaryList,
  isAssetHierarchyQuery,
  isAssetModelQuery,
  isAssetPropertyValueQuery, isAssetSummaryQuery,
  SiteWiseAssetModuleInterface,
  SiteWiseAssetSessionInterface
} from './sitewise/types';
import { AssetState, DescribeAssetModelResponse, DescribeAssetResponse, Quality } from '@aws-sdk/client-iotsitewise';
import { Observable, Subscription } from 'rxjs';
import { AssetPropertyValue, AssetSummary } from '@aws-sdk/client-iotsitewise/dist-types/ts3.4';

export const ASSET_ID = 'assetABC123';
export const ASSET_MODEL_ID = 'assetModelABC123';
export const ASSET_PROPERTY_ID = 'assetPropertyIdAbc123';
export const HIERARCHY_ID = 'hierarchyIdAbc123';
export const creationDate: Date = new Date(2000, 0, 0);
export const lastUpdatedDate: Date = new Date(2021, 0, 0);
export const sampleAssetSummary: AssetSummary = {
  id: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  name: 'assetName',
  arn: 'arn:assetArn',
  creationDate: creationDate,
  lastUpdateDate: lastUpdatedDate,
  hierarchies: [],
  status: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
};
export const sampleAssetDescription: DescribeAssetResponse = {
  assetId: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  assetName: 'assetName',
  assetArn: 'arn:assetArn',
  assetCreationDate: creationDate,
  assetLastUpdateDate: lastUpdatedDate,
  assetHierarchies: [],
  assetStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
  assetCompositeModels: [],
  assetProperties: [],
};
export const sampleAssetModel: DescribeAssetModelResponse = {
  assetModelId: ASSET_MODEL_ID,
  assetModelName: 'Asset Model Name',
  assetModelDescription: 'a happy little asset model',
  assetModelArn: 'arn:assetModelArn',
  assetModelCreationDate: creationDate,
  assetModelLastUpdateDate: lastUpdatedDate,
  assetModelProperties: [],
  assetModelCompositeModels: [],
  assetModelHierarchies: [],
  assetModelStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
};
export const samplePropertyValue: AssetPropertyValue = {
  value: { stringValue: undefined, booleanValue: undefined, doubleValue: undefined, integerValue: 1234 },
  quality: Quality.GOOD,
  timestamp: {
    timeInSeconds: 100,
    offsetInNanos: 100,
  },
};

export class MockSiteWiseAssetsReplayData {
  public models: Map<string, DescribeAssetModelResponse> = new Map<string, DescribeAssetModelResponse>();
  public hierarchies: Map<string, HierarchyAssetSummaryList> = new Map<string, HierarchyAssetSummaryList>();
  public properties: Map<string, AssetPropertyValue> = new Map<string, AssetPropertyValue>();
  public assets: Map<string, AssetSummary> = new Map<string, AssetSummary>();

  public addAssetModels(newModels: DescribeAssetModelResponse[]) {
    newModels.forEach(model => this.models.set(model.assetModelId as string, model));
  }

  public addAssetSummaries(newAssetSummaries: AssetSummary[]) {
    newAssetSummaries.forEach(summary => this.assets.set(summary.id as string, summary));
  }

  public addAssetPropertyValues(propertyValue: {assetId: string, propertyId: string, value: AssetPropertyValue}) {
    this.properties.set(propertyValue.assetId + ':' + propertyValue.propertyId, propertyValue.value);
  }

  public addHierarchyAssetSummaryList(query: AssetHierarchyQuery, newHierarchyAssetSummaryList: HierarchyAssetSummaryList) {
    this.hierarchies.set(assetHierarchyQueryKey(query), newHierarchyAssetSummaryList);
  }
}


export class MockSiteWiseAssetSession implements SiteWiseAssetSessionInterface {
  private readonly replayData: MockSiteWiseAssetsReplayData;

  constructor(replayData: MockSiteWiseAssetsReplayData) {
    this.replayData = replayData;
  }

  addRequest(query: AssetModelQuery, observer: (assetModel: DescribeAssetModelResponse) => void): Subscription;
  addRequest(query: AssetPropertyValueQuery, observer: (assetPropertyValue: AssetPropertyValue) => void): Subscription;
  addRequest(query: AssetHierarchyQuery, observer: (assetSummary: HierarchyAssetSummaryList) => void): Subscription;
  addRequest(query: AssetSummaryQuery, observer: (assetSummary: AssetSummary) => void): Subscription;
  addRequest(query: AssetModelQuery | AssetPropertyValueQuery | AssetHierarchyQuery | AssetSummaryQuery,
             observer: ((assetModel: DescribeAssetModelResponse) => void)
               | ((assetPropertyValue: AssetPropertyValue) => void)
               | ((assetSummary: HierarchyAssetSummaryList) => void)
               | ((assetSummary: AssetSummary) => void)): Subscription {
    let observable: Observable<any>;
    if (isAssetModelQuery(query)) {
      observable = new Observable<DescribeAssetModelResponse>((observer) => {
        observer.next(this.replayData.models.get(query.assetModelId));
      });
    } else if (isAssetPropertyValueQuery(query)) {
      observable = new Observable<AssetPropertyValue>((observer) => {
        observer.next(this.replayData.properties.get(query.assetId + ':' + query.propertyId));
      });
    } else if (isAssetHierarchyQuery(query)) {
      observable = new Observable<HierarchyAssetSummaryList>((observer) => {
        observer.next(this.replayData.hierarchies.get(assetHierarchyQueryKey(query)));
      });
    } else if (isAssetSummaryQuery(query)) {
      observable = new Observable<AssetSummary>((observer) => {
        observer.next(this.replayData.assets.get(query.assetId));
      });
    } else {
      throw 'Unexpected request type: the type of the request object could not be determined';
    }

    return observable.subscribe(observer);
  }

  close(): void {
  }
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

it('no-op', () => { expect(true).toBeTruthy()});
