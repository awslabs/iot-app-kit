import { isEmpty, isEqual } from 'lodash';

import { IAnchorComponent, IDataBindingComponent, ISceneNode, KnownComponentType } from '../../interfaces';
import { IAnchorComponentInternal, IDataBindingComponentInternal, ISceneNodeInternal, RootState } from '../../store';
import { findComponentByType } from '../../utils/nodeUtils';
import { ISceneComponentInternal, IWidgetRuleMapInternal } from '../../store/internalInterfaces';

export interface ISceneScript {
  execute(state: RootState): void;
  clear(state: RootState): void;
}

export class AddTag implements ISceneScript {
  private scriptId: string;
  private rootNode?: ISceneNodeInternal; // TODO: remove? should support node based script component or not?
  private ruleConfig: IWidgetRuleMapInternal;

  constructor(id: string, { rootNode, ...ruleConfig }: { rootNode?: ISceneNodeInternal } & IWidgetRuleMapInternal) {
    this.scriptId = id;
    this.rootNode = rootNode;
    this.ruleConfig = ruleConfig;
  }

  findMatch = (state: RootState) => {
    // TODO: may find data binding from any component type
    const nodesWithDataBinding = state.getComponentRefByType(KnownComponentType.DataBinding);
    let matchingNodeRefs = isEmpty(this.ruleConfig.propertyNameFilters)
      ? Object.keys(state.document.nodeMap)
      : Object.keys(nodesWithDataBinding);

    if (!isEmpty(this.ruleConfig.nodeTypeFilters)) {
      let nodesWithType: string[] | undefined = undefined;
      this.ruleConfig.nodeTypeFilters?.forEach((type) => {
        const matchingNodes = Object.keys(state.getComponentRefByType(type));
        if (!nodesWithType) {
          nodesWithType = matchingNodes;
        } else {
          nodesWithType = nodesWithType.filter((ref) => matchingNodes.includes(ref));
        }
      });

      matchingNodeRefs = matchingNodeRefs.filter((ref) => nodesWithType?.includes(ref));
    }

    const nodes = state.getSceneNodesByRefs(matchingNodeRefs);
    return nodes.map((node) => {
      if (!node) return undefined;

      // DO NOT add Tag to generated Tag nodes
      if (node.properties['scriptId'] === this.scriptId) return undefined;

      if (!this.ruleConfig.propertyNameFilters || isEmpty(this.ruleConfig.propertyNameFilters)) {
        return { node };
      }

      const dataBindingComponent = findComponentByType(
        node,
        KnownComponentType.DataBinding,
      ) as IDataBindingComponentInternal;
      // TODO: change to alarm_status property name for real case
      const targetBinding = dataBindingComponent.valueDataBindings.find(
        (binding) =>
          (binding.valueDataBinding?.dataBindingContext as Record<string, string>)?.['propertyName'] ===
          this.ruleConfig.propertyNameFilters![0],
      );
      return targetBinding && targetBinding?.valueDataBinding && { node, targetBinding };
    });
  };

  execute = (state: RootState) => {
    const previousGeneratedNodeRefs = Object.values(state.document.nodeMap)
      .filter((node) => {
        return node.properties['scriptId'] === this.scriptId;
      })
      .map((node) => node.ref);

    const nodes = this.findMatch(state);

    const generatedNodeRefs: string[] = [];

    const nodesToAdd: ISceneNode[] = []
    const nodesToRemove: string[]= []
    const compToUpdate: [string, ISceneComponentInternal][] = []

    nodes.forEach((match) => {
      if (!match) return;

      // TODO: better node ref to avoid conflict?
      const tagNodeRef = this.scriptId + '-' + match.node.ref;
      const newTagComponent: IAnchorComponent = {
        type: KnownComponentType.Tag,
        valueDataBinding: match.targetBinding?.valueDataBinding,
        ruleBasedMapId: this.ruleConfig.ruleId,
      };

      generatedNodeRefs.push(tagNodeRef);

      const existingTagNode = state.getSceneNodeByRef(tagNodeRef);
      const existingTagComp = findComponentByType(existingTagNode, KnownComponentType.Tag) as IAnchorComponentInternal;
      if (existingTagNode && existingTagComp) {
        if (isEqual(existingTagComp, { ...newTagComponent, ref: existingTagComp.ref })) {
          return;
        } else {
          compToUpdate.push([existingTagNode.ref, { ...existingTagComp, ...newTagComponent }])
        }
      } else {
        const tagNode: ISceneNode = {
          ref: tagNodeRef,
          parentRef: match.node.ref,
          components: [newTagComponent],
          transform: {
            position: [0, 2.84, 0], // TODO: better position calculation for real case
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          properties: { scriptId: this.scriptId },
        };

        nodesToAdd.push(tagNode)
      }
    });

    state.appendSceneNodeBatch(nodesToAdd)
    state.updateComponentInternalBatch(compToUpdate)

    previousGeneratedNodeRefs.forEach((ref) => !generatedNodeRefs.includes(ref) && nodesToRemove.push(ref));
    state.removeSceneNodeBatch(nodesToRemove)
  };

  clear = (state: RootState) => {
    const nodes = Object.values(state.document.nodeMap);
    nodes.forEach((node) => {
      if (!node) return;

      if (node.properties['scriptId'] === this.scriptId) {
        state.removeSceneNode(node.ref);
      }
    });
  };
}
