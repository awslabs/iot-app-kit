import React, { useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { RelatedTable, useTreeCollection } from '@iot-app-kit/related-table';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal } from '../../../store';
import { useStore } from '../../../store/Store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';

const ClickableDiv = styled.div`
  cursor: pointer;
  user-select: none;
`;

interface SceneHierarchyNode {
  nodeRef: string;
  name: string;
  hasChildren: boolean;
  parentRef?: string;
}

const flatten = (
  getNode: (nodeRef: string) => ISceneNodeInternal | undefined,
  currentNodeRef: string,
  parentRef: string | undefined,
  accumulator: SceneHierarchyNode[] = [],
) => {
  const node = getNode(currentNodeRef);

  if (node) {
    const result = {
      nodeRef: node.ref,
      name: node.name,
      hasChildren: node.childRefs?.length > 0,
      parentRef,
    };

    if (node.childRefs?.length > 0) {
      node.childRefs.forEach((childRef) => flatten(getNode, childRef, node.ref, accumulator));
    }

    accumulator.push(result);
  }
};

const SceneHierarchyPanel: React.FC = (_) => {
  const log = useLifecycleLogging('SceneHierarchyPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);

  const nodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const rootNodeRefs = useStore(sceneComposerId)((state) => state.document.rootNodeRefs);
  const setCameraTarget = useStore(sceneComposerId)((state) => state.setCameraTarget);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const intl = useIntl();

  const sceneHierarchy: SceneHierarchyNode[] = useMemo(() => {
    const results = [];

    rootNodeRefs.forEach((rootNodeRef) => {
      flatten(getSceneNodeByRef, rootNodeRef, undefined, results);
    });

    return results;
  }, [nodeMap, rootNodeRefs]);

  const columnDefinitions = [
    {
      id: intl.formatMessage({ defaultMessage: 'name', description: 'Column id' }),
      header: intl.formatMessage({ defaultMessage: 'Name', description: 'Column header' }),

      cell: (item: any) => (
        <ClickableDiv
          onClick={(event) => {
            if (isViewing()) {
              setCameraTarget(item.nodeRef, 'transition');
            }

            if (selectedSceneNodeRef === item.nodeRef) {
              setSelectedSceneNodeRef(undefined);
            } else {
              setSelectedSceneNodeRef(item.nodeRef);
            }

            event.stopPropagation();
          }}
          onDoubleClick={(event) => {
            if (!isViewing()) {
              // Double click is called after a single click event. In the double click case we need to override the behavior of deselect
              setSelectedSceneNodeRef(item.nodeRef);
              setCameraTarget(item.nodeRef, 'transition');
            }
            event.stopPropagation();
          }}
        >
          {item.name}
        </ClickableDiv>
      ),
    },
  ];

  const { expandNode, items, collectionProps } = useTreeCollection(sceneHierarchy, {
    keyPropertyName: 'nodeRef',
    parentKeyPropertyName: 'parentRef',
    columnDefinitions,
    sorting: {},
    selection: {
      trackBy: 'nodeRef',
    },
  });

  // Expand to the selected node
  useLayoutEffect(() => {
    let currentNode = getSceneNodeByRef(selectedSceneNodeRef);
    const pathToRoot: string[] = [];
    while (currentNode) {
      pathToRoot.push(currentNode.ref);
      currentNode = getSceneNodeByRef(currentNode.parentRef);
    }
    let currentItems = items;
    while (pathToRoot.length > 1) {
      const nodeToExpand = pathToRoot.pop();
      const selectedItem = currentItems.find((item) => item.nodeRef === nodeToExpand);
      if (!selectedItem) {
        log?.error('Error: unexpected item tree structure, ignoring the error');
        return;
      }

      if (!selectedItem.isExpanded() && selectedItem.hasChildren) {
        expandNode(selectedItem);
      }
      currentItems = selectedItem.getChildren();
    }
  }, [items, selectedSceneNodeRef, getSceneNodeByRef]);

  const onSelectionChange = useCallback(
    (event) => {
      const nodeRef = event.detail.selectedItems[0].nodeRef;
      setSelectedSceneNodeRef(nodeRef);
    },
    [setSelectedSceneNodeRef],
  );

  const onExpandNode = useCallback(
    (clickedNode) => {
      let currentNode = getSceneNodeByRef(selectedSceneNodeRef);
      while (currentNode) {
        currentNode = getSceneNodeByRef(currentNode.parentRef);
        if (currentNode?.ref === clickedNode.nodeRef) {
          // Unselect the selected scene node if the clicked one is its parent
          setSelectedSceneNodeRef(undefined);
          break;
        }
      }
      expandNode(clickedNode);
    },
    [expandNode],
  );

  // Remove ref from the props, as ReactTable does not accept a ref prop
  const { ref, ...collectionPropsWithoutRef } = collectionProps;

  return (
    <RelatedTable
      {...collectionPropsWithoutRef}
      selectedItems={selectedSceneNodeRef ? [{ nodeRef: selectedSceneNodeRef } as any] : []}
      onSelectionChange={onSelectionChange}
      expandChildren={onExpandNode}
      columnDefinitions={columnDefinitions}
      trackBy='nodeRef'
      selectionType='single'
      items={items}
    />
  );
};

export default SceneHierarchyPanel;
