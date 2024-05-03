import React, { FC, createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { findComponentByType, getRelativeTransform } from '../../../utils/nodeUtils';
import { ISceneNodeInternal, useNodeErrorState, useSceneDocument, useStore } from '../../../store';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ITransform, KnownComponentType } from '../../../interfaces';
import { RecursivePartial } from '../../../utils/typeUtils';

import ISceneHierarchyNode from './model/ISceneHierarchyNode';

type SelectionMode = 'single' | 'multi';

interface ISceneHierarchyContext {
  rootNodes: ISceneHierarchyNode[];
  searchTerms: string;
  selected?: string;
  pathFromSelectedToRoot?: string[];
  selectionMode: SelectionMode;
  getChildNodes(parentRef: string): Promise<ISceneHierarchyNode[]>;
  search(terms: string): void;
  select(objectRef: string): void;
  toggleObjectVisibility(objectRef: string): void;
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
  children: ReactNode;
}

export const Context = createContext<ISceneHierarchyContext>({
  rootNodes: [],
  searchTerms: '',
  selectionMode: 'single',
  validationErrors: {},
  search: () => {},
  select: () => {},
  move: () => {},
  toggleObjectVisibility: () => {},
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
  const log = useLifecycleLogging('SceneHierarchyDataProvider');
  const sceneComposerId = useSceneComposerId();
  const { document, removeSceneNode } = useStore(sceneComposerId)((state) => state);
  const { updateSceneNodeInternal } = useSceneDocument(sceneComposerId);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);
  const { nodeMap } = document;
  const { nodeErrorMap: validationErrors } = useNodeErrorState(sceneComposerId);

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

  const [pathToRoot, setpathToRoot] = useState<string[]>([]);
  useEffect(() => {
    let currentNode = getSceneNodeByRef(selectedSceneNodeRef);
    const parentNodes: string[] = [];
    while (currentNode) {
      currentNode = getSceneNodeByRef(currentNode.parentRef);
      if (currentNode && parentNodes.indexOf(currentNode.ref) === -1) {
        parentNodes.push(currentNode.ref);
      }
    }
    setpathToRoot(parentNodes);
  }, [selectedSceneNodeRef]);

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
      const oldParentRef = originalObject?.parentRef as string;

      if (oldParentRef === newParentRef) {
        log?.verbose('Parent ref unchanged. Do nothing.');
        return;
      }

      let newParentObject3D = getObject3DBySceneNodeRef(newParentRef);
      const newParent = getSceneNodeByRef(newParentRef);

      // If the direct new parent is a sub model node, use its modelRef parent
      // to calculate the new transforms to prevent the object froming being
      // moved to a wrong position calculated from the sub model world space.
      if (findComponentByType(newParent, KnownComponentType.SubModelRef)) {
        let hierarchyParent = newParent;
        while (hierarchyParent && !findComponentByType(hierarchyParent, KnownComponentType.ModelRef)) {
          hierarchyParent = getSceneNodeByRef(hierarchyParent.parentRef);
        }
        newParentObject3D = getObject3DBySceneNodeRef(hierarchyParent?.ref);
      }

      let maintainedTransform: ITransform | null = null;
      if (originalObject3D) {
        maintainedTransform = getRelativeTransform(originalObject!, newParent!, getSceneNodeByRef);
      }

      // Create updates to the moving object
      const partial: RecursivePartial<ISceneNodeInternal> = { parentRef: newParentRef };
      if (maintainedTransform) {
        // Update the node position to remain in its world space
        partial.transform = maintainedTransform;
      }

      updateSceneNodeInternal(objectRef, partial);
    },
    [updateSceneNodeInternal, getSceneNodeByRef, nodeMap, document],
  );

  const toggleObjectVisibility = useCallback(
    (objectRef: string) => {
      const object = getObject3DBySceneNodeRef(objectRef);
      if (object) {
        object.visible = !object.visible;
        object.traverse((child) => {
          if (child?.userData?.componentType === KnownComponentType.DataOverlay) {
            // explicitly set child to match parent visibility setting
            child.visible = object.visible;
          }
        });
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
          pathFromSelectedToRoot: pathToRoot,
          move,
          searchTerms,
          search,
          selectionMode,
          select,
          unselect,
          toggleObjectVisibility,
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
