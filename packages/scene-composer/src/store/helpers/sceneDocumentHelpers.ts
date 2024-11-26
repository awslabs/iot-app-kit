import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';
import type { PartialDeep } from 'type-fest';
import { RESERVED_LAYER_ID } from '../../common/entityModelConstants';
import type ILogger from '../../logger/ILogger';
import { isDynamicNode, isDynamicScene } from '../../utils/entityModelUtils/sceneUtils';
import { updateEntity } from '../../utils/entityModelUtils/updateNodeEntity';
import { mergeDeep } from '../../utils/objectUtils';
import { type RootState } from '../Store';
import { type ISceneDocumentInternal, type ISceneNodeInternal } from '../internalInterfaces';
import { addNodeToComponentNodeMap, deleteNodeFromComponentNodeMap } from './componentMapHelpers';
import interfaceHelpers from './interfaceHelpers';

export const removeNode = (document: ISceneDocumentInternal, nodeRef: string, logger: ILogger): ISceneNodeInternal => {
  const nodeToRemove = document.nodeMap[nodeRef]!;
  if (!nodeToRemove) {
    return nodeToRemove;
  }
  const subTreeNodeRefs: string[] = [nodeRef];
  const findSubTreeNodes = (node: ISceneNodeInternal, accumulator: string[]) => {
    node.childRefs.forEach((childRef) => {
      accumulator.push(childRef);
      const childNode = document.nodeMap[childRef];
      if (!childNode) {
        logger.warn('unable to find the child node by ref', childRef);
      } else {
        findSubTreeNodes(childNode, accumulator);
      }
    });
  };
  findSubTreeNodes(nodeToRemove, subTreeNodeRefs);

  logger.verbose('removing the following nodes', subTreeNodeRefs);

  // remove the nodes from nodemap
  subTreeNodeRefs.forEach((current) => {
    deleteNodeFromComponentNodeMap(document.componentNodeMap, document.nodeMap[current]);
    delete document.nodeMap[current];
  });

  // remove from componentNodeMap
  deleteNodeFromComponentNodeMap(document.componentNodeMap, nodeToRemove);

  // remove the node from root node array if it is a root node
  if (!nodeToRemove.parentRef) {
    const rootIndex = document.rootNodeRefs.findIndex((v) => v === nodeRef);
    if (rootIndex !== -1) {
      document.rootNodeRefs.splice(rootIndex, 1);
    }
  } else {
    // remove the node from parent
    const indexOfNodeInParent = document.nodeMap[nodeToRemove.parentRef]!.childRefs.findIndex(
      (ref) => ref === nodeToRemove.ref,
    );
    indexOfNodeInParent >= 0 && document.nodeMap[nodeToRemove.parentRef]?.childRefs.splice(indexOfNodeInParent, 1);
  }

  return nodeToRemove;
};

export const renderSceneNodes = (
  nodes: ISceneNodeInternal[],
  document: ISceneDocumentInternal,
  logger: ILogger,
): void => {
  const newNodeRefs: string[] = [];
  const existingNodeRefs = Object.keys(document.nodeMap);

  const childRefUpdates: Record<string, string[]> = {};

  nodes.forEach((node) => {
    newNodeRefs.push(node.ref);
    if (node.childRefs && node.childRefs.length > 0) {
      throw new Error('Error: node with children are not supported by append operation');
    }
    const newNode = interfaceHelpers.createSceneNodeInternal(node);

    if (!newNode.properties.layerIds) {
      // required for isDynamicNode checks still
      newNode.properties.layerIds = [RESERVED_LAYER_ID];
    }
    // check if node already exists
    if (document.nodeMap[newNode.ref]) {
      logger.warn('adding an exising node will override it with the new version.');

      // replace the random component.ref with node.ref, and childRefs with empty since it will be handled later
      const replacer = (key: string, value: unknown) => {
        if (key === 'ref') {
          return newNode.ref;
        }
        if (key === 'childRefs') {
          return [];
        }
        return value;
      };
      // Override existing node with new version when node data is changed
      if (JSON.stringify(document.nodeMap[newNode.ref], replacer) !== JSON.stringify(newNode, replacer)) {
        // Clean up refs for current version
        deleteNodeFromComponentNodeMap(document.componentNodeMap, document.nodeMap[newNode.ref]);

        // TODO: merge the new change into old node instead of fully replacing it.
        // e.g. combine the layerIds list, do not change the component ref when possible to avoid
        // unnecessary rerender
        document.nodeMap[newNode.ref] = newNode;
        addNodeToComponentNodeMap(document.componentNodeMap, newNode);
      }
    } else {
      document.nodeMap[newNode.ref] = newNode;
      addNodeToComponentNodeMap(document.componentNodeMap, newNode);
    }

    // Update the parent node of the inserted node
    if (!newNode.parentRef) {
      if (!document.rootNodeRefs.includes(newNode.ref)) {
        document.rootNodeRefs.push(newNode.ref);
      }
    } else {
      if (!childRefUpdates[newNode.parentRef]) {
        childRefUpdates[newNode.parentRef] = [];
      }
      if (!childRefUpdates[newNode.parentRef].includes(newNode.ref)) {
        childRefUpdates[newNode.parentRef].push(newNode.ref);
      }
    }
  });

  Object.keys(childRefUpdates).forEach((parentRef) => {
    const childRefs = childRefUpdates[parentRef];
    document.nodeMap[parentRef].childRefs = childRefs;
  });

  // Remove previous dynamic nodes that are not available any more
  existingNodeRefs.forEach((ref) => {
    if (isDynamicNode(document.nodeMap[ref]) && !newNodeRefs.find((newRef) => newRef === ref)) {
      removeNode(document, ref, logger);
    }
  });
};

export const appendSceneNode = (draft: RootState, node: ISceneNodeInternal, disableAutoSelect?: boolean): void => {
  if (!draft.document) {
    return;
  }
  draft.document.nodeMap[node.ref] = node;

  // Update the parent node of the inserted node
  if (!node.parentRef) {
    draft.document!.rootNodeRefs.push(node.ref);
  } else {
    draft.document!.nodeMap[node.parentRef]!.childRefs.push(node.ref);
  }

  // Update componentNodeMap
  addNodeToComponentNodeMap(draft.document.componentNodeMap, node);

  // Update the selected node
  if (!disableAutoSelect) {
    draft.selectedSceneNodeRef = node.ref;
  }

  draft.lastOperation = 'appendSceneNodeInternal';
};

export const updateSceneNode = (
  draft: RootState,
  ref: string,
  partial: PartialDeep<ISceneNodeInternal>,
  skipEntityUpdate?: boolean,
): void => {
  // cache these values before merge deep overwrites them
  const nodeToMove = cloneDeep(draft.document.nodeMap[ref]);
  const oldParentRef = nodeToMove?.parentRef;
  const oldParent = draft.document.nodeMap[oldParentRef || ''];

  // Ignore childRefs from partial since it's determined by parentRef and handled by this function
  const filteredPartial = partial;
  delete partial.childRefs;

  // update target node
  mergeDeep(draft.document.nodeMap[ref], filteredPartial);

  // Reorder logics
  if ('parentRef' in partial) {
    const newParentRef = partial.parentRef;

    // remove target node from old parent
    if (!oldParentRef) {
      draft.document.rootNodeRefs = draft.document.rootNodeRefs.filter((root) => root !== ref);
    } else {
      draft.document.nodeMap[oldParentRef].childRefs = oldParent.childRefs.filter((child) => child !== ref);
    }

    // update new parent to have target node as child
    if (!newParentRef) {
      draft.document.rootNodeRefs.push(ref);
    } else {
      draft.document.nodeMap[newParentRef].childRefs.push(ref);
    }
  }

  const updatedNode = draft.document.nodeMap[ref];
  if (isDynamicScene(draft.document) && !skipEntityUpdate) {
    const compsToBeUpdated = !isEmpty(partial.components) ? updatedNode.components : undefined;
    const sceneRootEntityId = draft.document.properties?.sceneRootEntityId;
    updateEntity(updatedNode, compsToBeUpdated, undefined, nodeToMove, sceneRootEntityId);
  }
};
