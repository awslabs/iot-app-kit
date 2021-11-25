import { Component, h, Prop, State, Watch } from '@stencil/core';
import {
  getSiteWiseAssetModule,
  SiteWiseAssetTreeModule,
  SiteWiseAssetTreeQuery,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeSession,
  BranchReference,
  AssetTreeSubscription,
  HierarchyGroup,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-asset-tree-demo',
  shadow: false,
})
export class IotAssetTreeDemo {
  @Prop() query: SiteWiseAssetTreeQuery;
  @Prop() subscription: AssetTreeSubscription;
  @State() roots: SiteWiseAssetTreeNode[] = [];

  componentWillLoad() {
    // TODO: this needs to be done elsewhere...
    let session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeModule(getSiteWiseAssetModule()).startSession(
      this.query
    );
    this.subscription = session.subscribe((newTree) => {
      this.roots = newTree;
      // check the tree for any new unexpanded nodes and expand them:
      this.expandNodes(newTree);
    });
  }

  expandNodes(nodes: SiteWiseAssetTreeNode[]) {
    nodes.forEach((node) => {
      Array.from(node.hierarchies.values()).forEach((hierarchyGroup) => {
        if (!hierarchyGroup.isExpanded) {
          this.subscription.expand(new BranchReference(node.asset.id, hierarchyGroup.id));
        }
        this.expandNodes(hierarchyGroup.children);
      });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div>
        <h1>Tree Demo</h1>
        {this.renderAssetList(this.roots)}
      </div>
    );
  }

  renderAssetList(assets: SiteWiseAssetTreeNode[]) {
    if (!assets) {
      return '';
    }

    return <ul>{assets.map((asset) => this.renderAsset(asset))}</ul>;
  }

  renderAsset(assetNode: SiteWiseAssetTreeNode) {
    return (
      <li key={'asset-' + assetNode.asset?.id}>
        {assetNode.asset?.name}
        {this.renderHierarchies(assetNode)}
      </li>
    );
  }

  renderHierarchies(node: SiteWiseAssetTreeNode) {
    if (!node.hierarchies || !node.hierarchies.size) {
      return;
    }

    return <ul>{Array.from(node.hierarchies.values()).map((hierarchy) => this.renderHierarchy(hierarchy))}</ul>;
  }

  renderHierarchy(hierarchy: HierarchyGroup) {
    if (hierarchy.children && hierarchy.children.length) {
      return (
        <li key={'hierarchy-' + hierarchy.id}>
          {hierarchy.name}
          {this.renderAssetList(hierarchy?.children)}
        </li>
      );
    }
  }
}
