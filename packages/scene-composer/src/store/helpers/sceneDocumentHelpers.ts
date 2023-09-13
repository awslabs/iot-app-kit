import ILogger from '../../logger/ILogger';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../internalInterfaces';

import { deleteNodeFromComponentNodeMap } from './componentMapHelpers';

export const removeNode = (document: ISceneDocumentInternal, nodeRef: string, logger: ILogger) => {
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
    document.nodeMap[nodeToRemove.parentRef]?.childRefs.splice(indexOfNodeInParent, 1);
  }

  return nodeToRemove;
};
