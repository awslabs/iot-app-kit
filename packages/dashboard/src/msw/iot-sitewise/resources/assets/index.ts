import { AssetFactory } from './AssetFactory';
import {
  SITE_ASSET_MODEL,
  PRODUCTION_LINE_ASSET_MODEL,
  REACTOR_ASSET_MODEL,
  STORAGE_TANK_ASSET_MODEL,
} from '../assetModels';
import type { Asset, AssetModel } from '../types';

const siteAssetFactory = new AssetFactory(SITE_ASSET_MODEL);
const productionLineAssetFactory = new AssetFactory(PRODUCTION_LINE_ASSET_MODEL);
const reactorAssetFactory = new AssetFactory(REACTOR_ASSET_MODEL);
const storageTankAssetFactory = new AssetFactory(STORAGE_TANK_ASSET_MODEL);

type AssetHierarchy = { asset: Asset; children?: AssetHierarchy }[];

class AssetHierarchyClient {
  readonly #assetHierarchy: AssetHierarchy;

  constructor(assetHierarchy: AssetHierarchy) {
    this.#assetHierarchy = assetHierarchy;
  }

  public getRootAssets(): Asset[] {
    const rootAssets = this.#assetHierarchy.map(({ asset }) => asset);

    return rootAssets;
  }

  public findAssetById(assetId: string): Asset | undefined {
    const node = this.#searchById(assetId, this.#assetHierarchy);
    const asset = node?.asset;

    return asset;
  }

  public findChildren(assetId: string, hierarchyId: string): Asset[] {
    const node = this.#searchById(assetId, this.#assetHierarchy);
    const hierarchy = node?.asset.assetHierarchies?.find(({ id }) => id === hierarchyId);
    // childAssetModelId is not on Assets - We keep it in the translation from AssetModel to Asset to enable this search.
    const hierarchyAsAssetModelHierarchy = hierarchy as NonNullable<AssetModel['assetModelHierarchies']>[number];
    const childAssetModelId = hierarchyAsAssetModelHierarchy.childAssetModelId;
    const children = node?.children?.map(({ asset }) => asset) ?? [];
    const childrenOfHierachy = children.filter(({ assetModelId }) => assetModelId === childAssetModelId);

    return childrenOfHierachy;
  }

  public findParentAsset(assetId: string): Asset | undefined {
    const parentNode = this.#searchParentById(assetId, this.#assetHierarchy);
    const parentAsset = parentNode?.asset;

    return parentAsset;
  }

  #searchById(assetId: string, assetHierarchy: AssetHierarchy): AssetHierarchy[number] | undefined {
    for (const node of assetHierarchy) {
      if (node.asset.assetId === assetId) {
        return node;
      }

      if (node.children) {
        const foundNode = this.#searchById(assetId, node.children);

        if (foundNode) {
          return foundNode;
        }
      }
    }
  }

  #searchParentById(
    assetId: string,
    assetHierarchy: AssetHierarchy,
    parentNode?: AssetHierarchy[number]
  ): AssetHierarchy[number] | undefined {
    for (const node of assetHierarchy) {
      if (node.asset.assetId === assetId) {
        return parentNode;
      }

      if (node.children) {
        const foundNode = this.#searchParentById(assetId, node.children, node);

        if (foundNode) {
          return foundNode;
        }
      }
    }
  }
}

export const ASSET_HIERARCHY = new AssetHierarchyClient(
  [
    { assetName: 'Africa Site' },
    { assetName: 'Antarctica Site' },
    { assetName: 'Asia Site' },
    { assetName: 'Australia Site' },
    { assetName: 'Europe Site' },
    { assetName: 'North America Site' },
    { assetName: 'South America Site' },
  ].map(({ assetName }) => ({
    asset: siteAssetFactory.create({ assetName }),
    children: new Array(100).fill(null).map((_, i) => ({
      asset: productionLineAssetFactory.create({ assetName: `Production Line ${i + 1}` }),
      children: [
        ...new Array(10)
          .fill(null)
          .map((_, j) => ({ asset: reactorAssetFactory.create({ assetName: `Reactor ${j + 1}` }) })),
        ...new Array(15)
          .fill(null)
          .map((_, j) => ({ asset: storageTankAssetFactory.create({ assetName: `Storage Tank ${j + 1}` }) })),
      ],
    })),
  }))
);

export const giantFlatAssetHierarchy = new AssetHierarchyClient(
  new Array(10000).fill(null).map((_, i) => ({ asset: siteAssetFactory.create({ assetName: `Site ${i + 1}` }) }))
);
