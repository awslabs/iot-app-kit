import ILogger from '../../logger/ILogger';
import { RootState } from '../Store';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../internalInterfaces';

import { addNodeToComponentNodeMap, deleteNodeFromComponentNodeMap } from './componentMapHelpers';
import interfaceHelpers from './interfaceHelpers';

export const removeNode = (document: ISceneDocumentInternal, nodeRef: string, logger: ILogger): ISceneNodeInternal => {
  const nodeToRemove = document.nodeMap[nodeRef]!;
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
    indexOfNodeInParent >= 0 ?? document.nodeMap[nodeToRemove.parentRef]?.childRefs.splice(indexOfNodeInParent, 1);
  }

  return nodeToRemove;
};

export const renderSceneNodesFromLayers = (
  nodes: ISceneNodeInternal[],
  layerId: string,
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

  // Remove previous nodes from the layer that are not available any more
  existingNodeRefs.forEach((ref) => {
    if (document.nodeMap[ref].properties.layerIds?.includes(layerId) && !newNodeRefs.find((newRef) => newRef === ref)) {
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
