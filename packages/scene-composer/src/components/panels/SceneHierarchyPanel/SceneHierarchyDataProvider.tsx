import React, { FC, createContext, useContext, useCallback, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { findComponentByType, isEnvironmentNode } from '../../../utils/nodeUtils';
import { ISceneNodeInternal, useNodeErrorState, useStore } from '../../../store';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { KnownComponentType } from '../../../interfaces';

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
  canExpand: boolean,
  hideChild?: boolean,
) => {
  return {
    objectRef: ref,
    name,
    componentTypes: components.map((c) => c.type),
    hasChildren: canExpand,
    childRefs: hideChild ? [] : childRefs,
    parentRef,
  } as ISceneHierarchyNode;
};

export const useChildNodes = (parentRef: string) => {
  const { getChildNodes } = useSceneHierarchyData();
  const [loading, setLoading] = useState(false);
  const [childNodes, setChildNodes] = useState([] as ISceneHierarchyNode[]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await getChildNodes(parentRef);
      setChildNodes(results);
      setLoading(false);
    })();
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
  const { updateSceneNodeInternal, isEditing } = useStore(sceneComposerId)((state) => state);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);

  const { nodeErrorMap: validationErrors } = useNodeErrorState(sceneComposerId);

  const [searchTerms, setSearchTerms] = useState('');
  const unfilteredNodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const [, setFilteredNodeMap] = useState([] as ISceneNodeInternal[]);

  const nodeMap =
    searchTerms === ''
      ? unfilteredNodeMap
      : Object.values(unfilteredNodeMap).filter((node) => searchMatcher(node, searchTerms));

  const rootNodeRefs = Object.values(nodeMap)
    .filter((item) => !item.parentRef && (!isEnvironmentNode(item) || isEditing()))
    .map((item) => item.ref);

  const unfilteredRootNodeRefs = Object.values(unfilteredNodeMap)
    .filter((item) => !item.parentRef && (!isEnvironmentNode(item) || !isViewing()))
    .map((item) => item.ref);

  const rootNodes: Readonly<ISceneNodeInternal>[] = !isEmpty(searchTerms)
    ? Object.values(nodeMap)
    : unfilteredRootNodeRefs
        .map(getSceneNodeByRef)
        .filter((node) => node !== undefined && searchMatcher(node, searchTerms))
        .map((item) => item as ISceneNodeInternal)
        .sort(sortNodes);

  useEffect(() => {
    if (searchTerms === '') {
      setFilteredNodeMap([]);
    } else {
      const matchingNodes = Object.values(nodeMap).filter((node) => searchMatcher(node, searchTerms));
      setFilteredNodeMap(matchingNodes);
    }
  }, [nodeMap, searchTerms]);

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
      updateSceneNodeInternal(objectRef, { parentRef: newParentRef });
    },
    [sceneComposerId],
  );

  const show = useCallback(
    (objectRef: string) => {
      const getObject3DBySceneNodeRef = useStore(sceneComposerId).getState().getObject3DBySceneNodeRef;
      const object = getObject3DBySceneNodeRef(objectRef);
      if (object) {
        object.visible = true;
      }
    },
    [sceneComposerId],
  );

  const hide = useCallback(
    (objectRef: string) => {
      const getObject3DBySceneNodeRef = useStore(sceneComposerId).getState().getObject3DBySceneNodeRef;
      const object = getObject3DBySceneNodeRef(objectRef);
      if (object) {
        object.visible = false;
      }
    },
    [sceneComposerId],
  );

  const remove = useCallback(
    (objectRef: string) => {
      const removeSceneNode = useStore(sceneComposerId).getState().removeSceneNode;
      removeSceneNode(objectRef);
    },
    [sceneComposerId],
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
