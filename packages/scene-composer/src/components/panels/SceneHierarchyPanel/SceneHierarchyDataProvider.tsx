import React, { FC, createContext, useContext, useCallback, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import useLogger from '../../../logger/react-logger/hooks/useLogger';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ISceneNodeInternal, useStore } from '../../../store';

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
}

interface SceneHierarchyDataProviderProps {
  selectionMode: SelectionMode;
}

export const Context = createContext<ISceneHierarchyContext>({
  rootNodes: [],
  searchTerms: '',
  selectionMode: 'single',
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
});

export const useSceneHierarchyData = () => {
  return useContext(Context);
};

const toSceneHeirarchyNode = (
  { ref, name, parentRef, components }: ISceneNodeInternal | Readonly<ISceneNodeInternal>,
  canExpand: boolean,
) => {
  return {
    objectRef: ref,
    name,
    componentTypes: components.map((c) => c.type),
    hasChildren: canExpand,
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
  return node.name.indexOf(terms) >= 0; // Basic search matching algorithm;
};

const sortNodes = (a, b) => {
  const textA = a.name.toUpperCase();
  const textB = b.name.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
};

const SceneHierarchyDataProvider: FC<SceneHierarchyDataProviderProps> = ({ selectionMode, children }) => {
  const log = useLogger('SceneHierarchyDataProvider');

  const sceneComposerId = useSceneComposerId();
  const {
    document,
    selectedSceneNodeRef,
    getSceneNodeByRef,
    setSelectedSceneNodeRef,
    updateSceneNodeInternal,
    getObject3DBySceneNodeRef,
    setCameraTarget,
    removeSceneNode,
  } = useStore(sceneComposerId)((state) => state);

  const { nodeMap } = document;

  const rootNodeRefs = Object.values(nodeMap)
    .filter((item) => !item.parentRef)
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
    [getSceneNodeByRef, sceneComposerId, nodeMap, rootNodeRefs, log],
  );

  const activate = useCallback(
    (nodeRef: string) => {
      setCameraTarget(nodeRef, 'transition');
    },
    [setCameraTarget],
  );

  const search = useCallback(
    (terms: string) => {
      setSearchTerms(terms);
    },
    [nodeMap],
  );

  const select = useCallback(
    (objectRef: string) => {
      setSelectedSceneNodeRef(objectRef);
    },
    [selectedSceneNodeRef, selectionMode],
  );

  const unselect = useCallback(() => {
    setSelectedSceneNodeRef(undefined); // TODO: Our existing state machine doesn't consider the possibility of multi-select
  }, [selectedSceneNodeRef]);

  const move = useCallback(
    (objectRef: string, newParentRef?: string) => {
      updateSceneNodeInternal(objectRef, { parentRef: newParentRef });
    },
    [updateSceneNodeInternal, getSceneNodeByRef, nodeMap],
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
          rootNodes: rootNodes.map((item) => toSceneHeirarchyNode(item, item.childRefs.length > 0)),
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
        }}
      >
        {children}
      </Context.Provider>
    </DndProvider>
  );
};

export default SceneHierarchyDataProvider;
