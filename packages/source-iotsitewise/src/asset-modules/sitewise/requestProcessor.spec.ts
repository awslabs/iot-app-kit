import { RequestProcessor } from './requestProcessor';
import { SiteWiseAssetCache } from './cache';
import { Observable } from 'rxjs';
import { HIERARCHY_ROOT_ID, LoadingStateEnum } from './types';
import { sampleAssetModel } from '../../__mocks__/assetModel';
import { sampleAssetSummary } from '../../__mocks__/asset';
import { ASSET_PROPERTY_STRING_VALUE } from '../../__mocks__/assetPropertyValue';
import type {
  AssetSummary,
  AssetPropertyValue,
  DescribeAssetCommandOutput,
  DescribeAssetModelResponse,
  DescribeAssetModelCommandOutput,
  GetAssetPropertyValueCommandOutput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type { HierarchyAssetSummaryList, SiteWiseAssetDataSource } from './types';
import type { ModeledDataStream } from '../describeModeledDataStreamRequest/types';

it('initializes', () => {
  expect(() => {
    new RequestProcessor({} as SiteWiseAssetDataSource, new SiteWiseAssetCache());
  }).not.toThrowError();
});

const createMockSiteWiseAssetDataSource = (): SiteWiseAssetDataSource => {
  return {
    describeAsset: (): Promise<DescribeAssetCommandOutput> => {
      throw 'No Calls Expected';
    },

    getPropertyValue: (): Promise<GetAssetPropertyValueCommandOutput> => {
      throw 'No Calls Expected';
    },

    describeAssetModel: (): Promise<DescribeAssetModelCommandOutput> => {
      throw 'No Calls Expected';
    },

    listAssets: (): Promise<ListAssetsCommandOutput> => {
      throw 'No Calls Expected';
    },

    listAssociatedAssets: (): Promise<ListAssociatedAssetsCommandOutput> => {
      throw 'No Calls Expected';
    },

    describeModeledDataStream: (): Promise<ModeledDataStream> => {
      throw 'No Calls Expected';
    },
  };
};

describe('Request an AssetSummary', () => {
  const mockDataSource = createMockSiteWiseAssetDataSource();
  const mockDescribeAsset = jest.fn();
  mockDescribeAsset.mockReturnValue(Promise.resolve(sampleAssetSummary));
  mockDataSource.describeAsset = mockDescribeAsset;

  const requestProcessor: RequestProcessor = new RequestProcessor(mockDataSource, new SiteWiseAssetCache());
  const observable: Observable<AssetSummary> = new Observable<AssetSummary>((observer) => {
    requestProcessor.getAssetSummary({ assetId: sampleAssetSummary.id as string }, observer);
  });

  it('waits for the AssetSummary', (done) => {
    observable.subscribe((result) => {
      expect(result).not.toBeUndefined();
      expect(result).toEqual(sampleAssetSummary);
      done();
    });
  });
});

describe('Request an Asset Model', () => {
  const mockDataSource = createMockSiteWiseAssetDataSource();
  const mockDescribeAssetModel = jest.fn();
  mockDescribeAssetModel.mockReturnValue(Promise.resolve(sampleAssetModel));
  mockDataSource.describeAssetModel = mockDescribeAssetModel;

  const requestProcessor: RequestProcessor = new RequestProcessor(mockDataSource, new SiteWiseAssetCache());
  const observable: Observable<DescribeAssetModelResponse> = new Observable<DescribeAssetModelResponse>((observer) => {
    requestProcessor.getAssetModel({ assetModelId: sampleAssetModel.assetModelId as string }, observer);
  });

  it('waits for the Asset Model', (done) => {
    observable.subscribe((result) => {
      expect(sampleAssetModel).toEqual(result);
      done();
    });
  });
});

describe('Request an Asset Property Value', () => {
  const mockDataSource = createMockSiteWiseAssetDataSource();
  const mockGetPropertyValue = jest.fn();
  mockGetPropertyValue.mockResolvedValue(ASSET_PROPERTY_STRING_VALUE);
  mockDataSource.getPropertyValue = mockGetPropertyValue;

  const requestProcessor: RequestProcessor = new RequestProcessor(mockDataSource, new SiteWiseAssetCache());
  const observable: Observable<AssetPropertyValue> = new Observable<AssetPropertyValue>((observer) => {
    requestProcessor.getAssetPropertyValue(
      {
        assetId: sampleAssetSummary.id as string,
        propertyId: 'doesnt matter',
      },
      observer
    );
  });

  it('waits for the Asset Property Value', (done) => {
    observable.subscribe({
      next: (result) => {
        expect(ASSET_PROPERTY_STRING_VALUE.propertyValue).toEqual(result);
        done();
      },
    });
  });
});

describe('Request an Asset Hierarchy of a parent Asset', () => {
  const mockDataSource = createMockSiteWiseAssetDataSource();
  const mockListAssociatedAssets = jest.fn();
  const result: ListAssetsCommandOutput = { $metadata: {}, assetSummaries: [sampleAssetSummary] };
  mockListAssociatedAssets.mockReturnValue(Promise.resolve<ListAssetsCommandOutput>(result));
  mockDataSource.listAssociatedAssets = mockListAssociatedAssets;
  const requestProcessor: RequestProcessor = new RequestProcessor(mockDataSource, new SiteWiseAssetCache());
  const observable: Observable<HierarchyAssetSummaryList> = new Observable<HierarchyAssetSummaryList>((observer) => {
    requestProcessor.getAssetHierarchy({ assetId: 'parentAssetId', assetHierarchyId: 'hierarchyId' }, observer);
  });

  it('waits for the Asset Hierarchy to become loaded', (done) => {
    observable.subscribe((result) => {
      // the worker returns the completed list of assets:
      expect({
        assetHierarchyId: 'hierarchyId',
        assets: [sampleAssetSummary],
        loadingState: LoadingStateEnum.LOADED,
      }).toEqual(result);
      done();
    });
  });
});

describe('Request the root assets', () => {
  const mockDataSource = createMockSiteWiseAssetDataSource();
  const mockListAssets = jest.fn();
  const result: ListAssetsCommandOutput = { $metadata: {}, assetSummaries: [sampleAssetSummary] };
  mockListAssets.mockReturnValue(Promise.resolve<ListAssetsCommandOutput>(result));
  mockDataSource.listAssets = mockListAssets;
  const requestProcessor: RequestProcessor = new RequestProcessor(mockDataSource, new SiteWiseAssetCache());

  const observable: Observable<HierarchyAssetSummaryList> = new Observable<HierarchyAssetSummaryList>((observer) => {
    requestProcessor.getAssetHierarchy({ assetHierarchyId: HIERARCHY_ROOT_ID }, observer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('waits for the root assets to become loaded', (done) => {
    observable.subscribe((result) => {
      // the worker returns the completed list of assets:
      expect({
        assetHierarchyId: HIERARCHY_ROOT_ID,
        assets: [sampleAssetSummary],
        loadingState: LoadingStateEnum.LOADED,
      }).toEqual(result);

      expect(mockListAssets).toHaveBeenCalled();
      done();
    });
  });

  // this test relies on previous test, since they use the same observer
  // we want to verify that we emit the cached data if we have already requested it
  it('emits cached data', (done) => {
    observable.subscribe((result) => {
      expect({
        assetHierarchyId: HIERARCHY_ROOT_ID,
        assets: [sampleAssetSummary],
        loadingState: LoadingStateEnum.LOADED,
      }).toEqual(result);

      expect(mockListAssets).not.toHaveBeenCalled();
      done();
    });
  });
});
