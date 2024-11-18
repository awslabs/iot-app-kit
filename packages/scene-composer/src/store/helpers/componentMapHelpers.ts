import { isEmpty } from 'lodash';

import { type ISceneNodeInternal } from '../internalInterfaces';
import { type KnownComponentType } from '../../interfaces';

export function deleteNodeFromComponentNodeMap(
  map: { [type in KnownComponentType | string]?: Record<string, string[]> },
  node: ISceneNodeInternal,
): void {
  node.components.forEach((comp) => {
    deleteComponentFromComponentNodeMap(map[comp.type], node.ref, comp.ref);
  });
}

export function deleteComponentFromComponentNodeMap(
  typeMap: Record<string, string[]> | undefined,
  nodeRef: string,
  compRef: string,
): void {
  if (!typeMap || !typeMap?.[nodeRef]) return;

  const index = typeMap[nodeRef].findIndex((r) => r === compRef);
  if (index !== undefined && index >= 0) {
    typeMap[nodeRef].splice(index, 1);
    if (isEmpty(typeMap[nodeRef])) {
      delete typeMap[nodeRef];
    }
  }
}

export function addNodeToComponentNodeMap(
  map: { [type in KnownComponentType | string]?: Record<string, string[]> },
  node: ISceneNodeInternal,
) {
  node.components.forEach((comp) => {
    if (!map[comp.type]) {
      map[comp.type] = {};
    }
    addComponentToComponentNodeMap(map[comp.type]!, node.ref, comp.ref);
  });
}

export function addComponentToComponentNodeMap(typeMap: Record<string, string[]>, nodeRef: string, compRef: string) {
  if (!typeMap[nodeRef]) {
    typeMap![nodeRef] = [];
  }
  typeMap[nodeRef].push(compRef);
}
