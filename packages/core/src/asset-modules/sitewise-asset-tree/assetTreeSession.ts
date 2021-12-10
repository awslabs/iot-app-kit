import {
  AssetTreeSubscription,
  BranchReference,
  HierarchyGroup,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQuery
} from './types';
import { BehaviorSubject, debounceTime, Subject, Subscription } from 'rxjs';
import {
  AssetHierarchyQuery,
  AssetModelQuery,
  HIERARCHY_ROOT_ID,
  LoadingStateEnum,
  SiteWiseAssetSessionInterface
} from '../sitewise/types';
import { AssetPropertyValue, AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

class Branch {
  public isExpanded: boolean = false;
  public assetIds: string[] = [];
  public subscription: Subscription;
  public loadingState: LoadingStateEnum = LoadingStateEnum.NOT_LOADED;
}

class AssetNode {
  public asset: AssetSummary;
  public model: DescribeAssetModelResponse | undefined;
  public properties: Map<string, AssetPropertyValue> = new Map();
  public subscription: Subscription;

  constructor(asset: AssetSummary) {
    this.asset = asset;
  }
}

export class SiteWiseAssetTreeSession {
  private readonly assetSession: SiteWiseAssetSessionInterface;
  private readonly query: SiteWiseAssetTreeQuery;
  // look up a node by its assetId
  private readonly assetNodes: Record<string, AssetNode> = {};
  // look up the id's of a hierarchy by "assetId-hierarchyId"
  private readonly branches: Record<string, Branch> = {};
  // a map of subscriptions that can be canceled
  // private readonly expansionSubscriptions: Record<string, Subscription> = {};
  private readonly subject: BehaviorSubject<SiteWiseAssetTreeNode[]> = new BehaviorSubject<SiteWiseAssetTreeNode[]>([]);
  private readonly rootBranchRef = new BranchReference(undefined, HIERARCHY_ROOT_ID)
  private readonly treeUpdateSubject = new Subject<void>();
  private treeUpdateSubscription: Subscription = this.treeUpdateSubject.pipe(debounceTime(1000/30))
      .subscribe(() =>this.emitTreeUpdate());

  constructor(assetSession: SiteWiseAssetSessionInterface, query: SiteWiseAssetTreeQuery) {
    this.assetSession = assetSession;
    this.query = query;

    if (!query.rootAssetId) {
      // query starts at the root of the account
      this.expand(this.rootBranchRef);
    } else {
      // query starts at the specified root Asset
      const root = new Branch();
      this.branches[this.rootBranchRef.key] = root;
      this.assetSession.addRequest({assetId: query.rootAssetId}, assetSummary => {
        this.saveAsset(assetSummary);
        root.assetIds.push(assetSummary.id as string);
        this.updateTree();
      });
    }
  }

  public subscribe(observer: (tree: SiteWiseAssetTreeNode[]) => void): AssetTreeSubscription {
    const subscription: Subscription = this.subject.subscribe(observer);

    return {
      unsubscribe: () => { subscription.unsubscribe() },
      expand: branchRef => { this.expand(branchRef) },
      collapse: branchRef => {this.collapse(branchRef)},
    }
  }

  public expand(branchRef: BranchReference): void {
    // if the branch exists already, just make it expanded
    const existingExpanded = this.makeExpanded(branchRef);

    // if the branch does not exist, or isn't fully loaded, start loading it
    if (!existingExpanded || existingExpanded.loadingState != LoadingStateEnum.LOADED) {
      const hierarchyQuery: AssetHierarchyQuery = {
        assetId: branchRef.assetId,
        assetHierarchyId: branchRef.hierarchyId,
      }

      this.assetSession.addRequest(hierarchyQuery, results => {
        this.saveExpandedHierarchy(branchRef, results.assets, results.loadingState);
        this.updateTree();
      });
    }
  }

  private loadAssetRelatedData(assetNode: AssetNode) {
    if (!assetNode.asset || !assetNode.asset.id) {
      throw "AssetNode is missing a properly specified Asset";
    }
    const assetId: string = assetNode.asset.id;

    // load related Asset Model and any of the requested properties that the Model contains
    if (this.query.withModels || this.query.propertyIds?.length) {
      this.assetSession.addRequest({assetModelId: assetNode.asset.assetModelId} as AssetModelQuery, model => {
        assetNode.model = model;
        this.updateTree();
        this.query.propertyIds?.forEach(propertyId => {
          if (this.containsPropertyId(model, propertyId)) {
            this.assetSession.addRequest({assetId: assetId, propertyId: propertyId}, propertyValue => {
              assetNode.properties.set(propertyId, propertyValue);
              this.updateTree();
            });
          }
        });
      });
    }
  }

  private containsPropertyId(model: DescribeAssetModelResponse, propertyId: string) {
    return propertyId && model.assetModelProperties?.some(prop => propertyId === prop.id);
  }

  public collapse(branch: BranchReference): void {
    const existingBranch = this.getBranch(branch);
    if (existingBranch) {
      existingBranch.isExpanded = false;
    }
    this.updateTree();
  }

  private updateTree() {
    this.treeUpdateSubject.next();
  }

  private emitTreeUpdate() {
    let roots: SiteWiseAssetTreeNode[] = [];
    const rootBranch = this.getBranch(this.rootBranchRef);
    if (rootBranch) {
      roots = rootBranch.assetIds.map(assetId => {
        return this.toAssetTreeNode(this.assetNodes[assetId]);
      });
    }
    this.subject.next(roots);
  }

  // recursively build the tree from a single starting node
  private toAssetTreeNode(assetNode: AssetNode): SiteWiseAssetTreeNode {
    const node: SiteWiseAssetTreeNode = {
      asset: assetNode.asset,
      hierarchies: new Map<string, HierarchyGroup>(),
      properties: new Map<string, AssetPropertyValue>(),
    };
    if (assetNode.model) {
      node.model = assetNode.model;
    }
    assetNode.properties.forEach((value, key) => {
      node.properties.set(key, value);
    });

    // recursively descend all hierarchies that have been loaded:
    assetNode.asset.hierarchies?.forEach(hierarchy => {
      const branchRef: BranchReference = new BranchReference(assetNode.asset.id as string, hierarchy.id as string);
      const group: HierarchyGroup = {
        name: hierarchy.name,
        id: branchRef.hierarchyId,
        children: [],
        isExpanded: false,
        loadingState: LoadingStateEnum.NOT_LOADED,
      };
      node.hierarchies.set(branchRef.hierarchyId, group);
      const existingBranch = this.getBranch(branchRef);
      if (existingBranch) {
        group.isExpanded = existingBranch?.isExpanded;
        group.loadingState = existingBranch?.loadingState;
        if (existingBranch.isExpanded) {
          group.children = existingBranch.assetIds.map(nodeId => this.toAssetTreeNode(this.assetNodes[nodeId]));
        }
      }
    });

    return node;
  }

  private getBranch(branch: BranchReference): Branch | undefined {
    return this.branches[branch.key];
  }

  private putBranch(branchRef: BranchReference, branch: Branch) {
    this.branches[branchRef.key] = branch;
  }

  private makeExpanded(branch: BranchReference): Branch | undefined {
    const existingBranch = this.getBranch(branch);
    // a tree update is only needed when the branch was not expanded
    if (existingBranch && !existingBranch.isExpanded) {
      existingBranch.isExpanded = true;
      if (existingBranch.assetIds.length) {
        this.updateTree();
      }
    }
    return existingBranch;
  }

  private saveExpandedHierarchy(branchRef: BranchReference,
                                childAssets: AssetSummary[],
                                loadingState: LoadingStateEnum) {
    let existingBranch = this.getBranch(branchRef);
    if (!existingBranch) {
      existingBranch = new Branch()
      existingBranch.isExpanded = true;
      this.putBranch(branchRef, existingBranch);
    }
    const assetIds: string[] = childAssets.map(assetSummary => assetSummary.id) as string[];
    existingBranch.assetIds = assetIds;
    existingBranch.loadingState = loadingState;
    childAssets.forEach(asset => this.saveAsset(asset));
  }

  // create new asset nodes as needed:
  private saveAsset(asset: AssetSummary): AssetNode {
    if (!asset.id) {
      throw "AssetSummary is missing an id property";
    }
    let assetNode: AssetNode = this.assetNodes[asset.id];
    if (!assetNode) {
      const assetNode = new AssetNode(asset);
      this.assetNodes[asset.id] = assetNode;
      this.loadAssetRelatedData(assetNode);
    }
    return assetNode;
  }
}
