import React, { FC, createContext, useContext, useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { isEnvironmentNode } from '../../../utils/nodeUtils';
import { ISceneNodeInternal, useNodeErrorState, useStore } from '../../../store';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';

import ISceneHierarchyNode from './model/ISceneHierarchyNode';

type SelectionMode = 'single' | 'multi';

interface ISceneHierarchyContext {
  rootNodes: ISceneHierarchyNode[];
  searchTerms: string;
  selected?: string;
  selectionMode: SelectionMode;
  getChildNodes(parentRef: string): ISceneHierarchyNode[];
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
  getChildNodes: () => [],
  isViewing: () => true,
});

export const useSceneHierarchyData = () => {
  return useContext(Context);
};

const toSceneHeirarchyNode = ({
  ref,
  name,
  parentRef,
  childRefs = [],
  components,
}: ISceneNodeInternal | Readonly<ISceneNodeInternal>) => {
  return {
    objectRef: ref,
    name,
    componentTypes: components.map((c) => c.type),
    childRefs,
    parentRef,
  } as ISceneHierarchyNode;
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
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);

  const { nodeErrorMap: validationErrors } = useNodeErrorState(sceneComposerId);

  const unfilteredNodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);

  const [searchTerms, setSearchTerms] = useState('');

  const nodeMap =
    searchTerms === ''
      ? unfilteredNodeMap
      : Object.values(unfilteredNodeMap).filter((node) => searchMatcher(node, searchTerms));

  const rootNodeRefs = Object.values(nodeMap)
    .filter((item) => !item.parentRef && (!isEnvironmentNode(item) || !isViewing()))
    .map((item) => item.ref);

  const rootNodes: Readonly<ISceneNodeInternal>[] = rootNodeRefs
    .map(getSceneNodeByRef)
    .filter((node) => node !== undefined && searchMatcher(node, searchTerms))
    .map((item) => item as ISceneNodeInternal)
    .sort(sortNodes);

  const getChildNodes = useCallback(
    (parentRef?: string) => {
      const nodeMap = useStore(sceneComposerId).getState().document.nodeMap;
      const results = Object.values(nodeMap)
        .filter((node) => node.parentRef === parentRef)
        .map(toSceneHeirarchyNode)
        .sort(sortNodes);

      return results;
    },
    [sceneComposerId],
  );

  const activate = useCallback(
    (nodeRef: string) => {
      const setCameraTarget = useStore(sceneComposerId).getState().setCameraTarget;
      setCameraTarget(nodeRef, 'transition');
    },
    [sceneComposerId],
  );

  const search = useCallback((terms: string) => {
    setSearchTerms(terms);
  }, []);

  const select = useCallback(
    (objectRef?: string) => {
      if (sceneComposerId) {
        const setSelectedSceneNodeRef = useStore(sceneComposerId).getState().setSelectedSceneNodeRef;
        setSelectedSceneNodeRef(objectRef);
      }
    },
    [sceneComposerId],
  );

  const unselect = useCallback(() => {
    select(undefined); // TODO: Our existing state machine doesn't consider the possibility of multi-select
  }, []);

  const move = useCallback(
    (objectRef: string, newParentRef?: string) => {
      const updateSceneNodeInternal = useStore(sceneComposerId).getState().updateSceneNodeInternal;
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
          rootNodes: rootNodes.map(toSceneHeirarchyNode),
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
