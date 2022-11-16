import React, { FC, createContext, useContext, useCallback, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isEmpty } from 'lodash';
import { Euler, Vector3, Quaternion } from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { findComponentByType, getFinalTransform, isEnvironmentNode } from '../../../utils/nodeUtils';
import { ISceneNodeInternal, useNodeErrorState, useSceneDocument, useStore } from '../../../store';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { KnownComponentType } from '../../../interfaces';
import { RecursivePartial } from '../../../utils/typeUtils';

import ISceneHierarchyNode from './model/ISceneHierarchyNode';

type SelectionMode = 'single' | 'multi';

interface ISceneHierarchyContext {
  rootNodes: ISceneHierarchyNode[];
  searchTerms: string;
  selected?: string;
  selectionMode: SelectionMode;
  getChildNodes(parentRef: string): Promise<ISceneHierarchyNode[]>;
  search(terms: string): void;
  select(objectRef: string): void;
  show(objectRef: string): void;
  hide(objectRef: string): void;
  activate(objectRef: string): void;
  unselect(objectRef: string): void;
  move(objectRef: string, newParentRef?: string);
  remove(objectRef: string);
  getObject3DBySceneNodeRef(objectRef: string);
  isViewing(): boolean;
  validationErrors: { [nodeRef: string]: string };
}

interface SceneHierarchyDataProviderProps {
  selectionMode: SelectionMode;
}

export const Context = createContext<ISceneHierarchyContext>({
  rootNodes: [],
  searchTerms: '',
  selectionMode: 'single',
  validationErrors: {},
  search: () => {},
  select: () => {},
  move: () => {},
  show: () => {},
  hide: () => {},
  activate: () => {},
  unselect: () => {},
  remove: () => {},
  getObject3DBySceneNodeRef: () => {},
  async getChildNodes() {
    return Promise.resolve([] as ISceneHierarchyNode[]);
  },
  isViewing: () => true,
});

export const useSceneHierarchyData = () => {
  return useContext(Context);
};

const toSceneHeirarchyNode = (
  { ref, name, parentRef, childRefs = [], components }: ISceneNodeInternal | Readonly<ISceneNodeInternal>,
  hideChild?: boolean,
) => {
  return {
    objectRef: ref,
    name,
    componentTypes: components.map((c) => c.type),
    childRefs: hideChild ? [] : childRefs,
    parentRef,
  } as ISceneHierarchyNode;
};

export const useChildNodes = (parentRef: string) => {
  const { getChildNodes } = useSceneHierarchyData();
  const [loading, setLoading] = useState(false);
  const [childNodes, setChildNodes] = useState([] as ISceneHierarchyNode[]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const results = await getChildNodes(parentRef);
      if (mounted) {
        setChildNodes(results);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getChildNodes]);

  return [childNodes, loading] as [ISceneHierarchyNode[], boolean];
};

const searchMatcher = (node: ISceneNodeInternal, terms: string) => {
  return node.name.toLowerCase().includes(terms.toLowerCase()); // Basic search matching algorithm;
};

const sortNodes = (a, b) => {
  const textA = a.name.toUpperCase();
  const textB = b.name.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
};

const SceneHierarchyDataProvider: FC<SceneHierarchyDataProviderProps> = ({ selectionMode, children }) => {
  useLifecycleLogging('SceneHierarchyDataProvider');
  const sceneComposerId = useSceneComposerId();
  const { document, removeSceneNode } = useStore(sceneComposerId)((state) => state);
  const { isEditing } = useStore(sceneComposerId)((state) => state);
  const { updateSceneNodeInternal, updateDocumentInternal } = useSceneDocument(sceneComposerId);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);
  const { nodeMap } = document;
  const { nodeErrorMap: validationErrors } = useNodeErrorState(sceneComposerId);

  const rootNodeRefs = Object.values(nodeMap)
    .filter((item) => !item.parentRef && (!isEnvironmentNode(item) || isEditing()))
    .map((item) => item.ref);

  const [searchTerms, setSearchTerms] = useState('');
  const [filteredNodeMap, setFilteredNodeMap] = useState([] as ISceneNodeInternal[]);

  useEffect(() => {
    if (searchTerms === '') {
      setFilteredNodeMap([]);
    } else {
      const matchingNodes = Object.values(nodeMap).filter((node) => searchMatcher(node, searchTerms));
      setFilteredNodeMap(matchingNodes);
    }
  }, [nodeMap, searchTerms]);

  const rootNodes: Readonly<ISceneNodeInternal>[] =
    filteredNodeMap.length > 0
      ? filteredNodeMap
      : rootNodeRefs
          .map(getSceneNodeByRef)
          .filter((node) => node !== undefined && searchMatcher(node, searchTerms))
          .map((item) => item as ISceneNodeInternal)
          .sort(sortNodes);

  const getChildNodes = useCallback(
    async (parentRef?: string) => {
      const results = Object.values(nodeMap)
        .filter((node) => node.parentRef === parentRef)
        .map((item) =>
          toSceneHeirarchyNode(item, Object.values(nodeMap).filter((n) => n.parentRef === item.ref).length > 0),
        )
        .sort(sortNodes);

      return Promise.resolve(results);
    },
    [getSceneNodeByRef, sceneComposerId, nodeMap, rootNodeRefs],
  );

  const activate = useCallback(
    (nodeRef: string) => {
      const setCameraTarget = useStore(sceneComposerId).getState().setCameraTarget;
      const node = getSceneNodeByRef(nodeRef);
      if (!isViewing() || !findComponentByType(node, KnownComponentType.Camera)) {
        setCameraTarget(nodeRef, 'transition');
      }
    },
    [sceneComposerId, isViewing],
  );

  const search = useCallback((terms: string) => {
    setSearchTerms(terms);
  }, []);

  const select = useCallback(
    (objectRef?: string) => {
      if (sceneComposerId) {
        useStore(sceneComposerId).getState().setSelectedSceneNodeRef(objectRef);
      }
    },
    [sceneComposerId],
  );

  const unselect = useCallback(() => {
    select(undefined); // TODO: Our existing state machine doesn't consider the possibility of multi-select
  }, []);

  const move = useCallback(
    (objectRef: string, newParentRef?: string) => {
      const originalObject = getSceneNodeByRef(objectRef);
      const originalObject3D = getObject3DBySceneNodeRef(objectRef);
      if (newParentRef) {
        const objectToMoveRef = originalObject?.ref as string;
        const oldParentRef = originalObject?.parentRef as string;
        const newParent = getSceneNodeByRef(newParentRef);
        const oldParent = getSceneNodeByRef(oldParentRef);
        const oldParentChildren = oldParent?.childRefs.filter((child) => child !== objectToMoveRef);
        const newParentObject = getObject3DBySceneNodeRef(newParentRef);
        let maintainedTransform: any = null;
        if (originalObject3D) {
          const worldPosition = originalObject3D.getWorldPosition(new Vector3());
          const worldRotation = new Euler().setFromQuaternion(originalObject3D.getWorldQuaternion(new Quaternion()));
          const worldScale = originalObject3D.getWorldScale(new Vector3());
          maintainedTransform = getFinalTransform(
            {
              position: worldPosition,
              rotation: worldRotation,
              scale: worldScale,
            },
            newParentObject,
          );
        }
        // remove child ref from parent
        if (!oldParentRef) {
          const newRoots = document.rootNodeRefs.filter((ref) => ref !== objectRef);
          updateDocumentInternal({ rootNodeRefs: newRoots });
        } else {
          updateSceneNodeInternal(oldParentRef, { childRefs: oldParentChildren });
        }
        // Create updates to the moving object
        const partial: RecursivePartial<ISceneNodeInternal> = { parentRef: newParentRef };
        if (maintainedTransform) {
          // Update the node position to remain in its world space
          partial.transform = {
            position: maintainedTransform.position.toArray(),
            rotation: maintainedTransform.rotation.toVector3().toArray(),
            scale: maintainedTransform.scale.toArray(),
          };
        }
        // update new parent to have new child
        updateSceneNodeInternal(newParentRef, { childRefs: [...newParent!.childRefs, objectRef] });
        // update node to have new parent
        updateSceneNodeInternal(objectToMoveRef, partial);
        // TODO: create single call to handle this
      }
    },
    [updateSceneNodeInternal, updateDocumentInternal, getSceneNodeByRef, nodeMap, document],
  );

  const show = useCallback(
    (objectRef: string) => {
      const object = getObject3DBySceneNodeRef(objectRef);
      if (object) {
        object.visible = true;
      }
    },
    [getObject3DBySceneNodeRef],
  );

  const hide = useCallback(
    (objectRef: string) => {
      const object = getObject3DBySceneNodeRef(objectRef);
      if (object) {
        object.visible = false;
      }
    },
    [getObject3DBySceneNodeRef],
  );

  const remove = useCallback(
    (objectRef: string) => {
      removeSceneNode(objectRef);
    },
    [removeSceneNode],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Context.Provider
        value={{
          rootNodes: rootNodes.map((node) => toSceneHeirarchyNode(node, !isEmpty(searchTerms))),
          validationErrors,
          activate,
          selected: selectedSceneNodeRef,
          move,
          searchTerms,
          search,
          selectionMode,
          select,
          unselect,
          show,
          hide,
          remove,
          getChildNodes,
          getObject3DBySceneNodeRef,
          isViewing,
        }}
      >
        {children}
      </Context.Provider>
    </DndProvider>
  );
};

export default SceneHierarchyDataProvider;
