import { useCollection, UseCollectionOptions, UseCollectionResult } from '@awsui/collection-hooks';
import { useEffect, useState } from 'react';
import { TableProps } from '@awsui/components-react/table';
import { ITreeNode, TreeMap } from '../Model/TreeNode';
import {
  buildTreeNodes,
  buildTreePrefix,
  expandOrCollapseChildren,
  filteringFunction,
  flatTree,
  sortTree,
} from '../utils';

export interface UseTreeCollection<T> extends UseCollectionOptions<ITreeNode<T>> {
  keyPropertyName: string;
  parentKeyPropertyName: string;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
}

export interface UseTreeCollectionResult<T> extends UseCollectionResult<ITreeNode<T>> {
  expandNode: (node: ITreeNode<T>) => void;
  reset: () => void;
}

export const useTreeCollection = <T>(
  items: T[],
  props: UseTreeCollection<T>,
  expanded = false
): UseTreeCollectionResult<T> => {
  const { keyPropertyName, parentKeyPropertyName, columnDefinitions, ...collectionProps } = props;
  const [treeMap, setTreeMap] = useState<TreeMap<T>>(new Map());
  const [nodes, setNodes] = useState<ITreeNode<T>[]>([]);
  const [sortState, setSortState] = useState<TableProps.SortingState<T>>({
    ...(collectionProps.sorting?.defaultState || {}),
  } as TableProps.SortingState<T>);
  const [columnsDefinitions] = useState(columnDefinitions);
  const [nodesExpanded, addNodesExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const treeNodes = buildTreeNodes(items, treeMap, keyPropertyName, parentKeyPropertyName);
    sortTree(treeNodes, sortState, columnsDefinitions);
    // only builds prefix after building and sorting the tree
    const tree = buildTreePrefix(treeNodes);
    setNodes(flatTree(tree));
  }, [items, keyPropertyName, parentKeyPropertyName, sortState, columnsDefinitions, treeMap]);

  const expandNode = (node: ITreeNode<T>) => {
    if (node) {
      const key = (node as any)[keyPropertyName];
      const internalNode = nodes.find((n) => (n as any)[keyPropertyName] === key);
      if (internalNode) {
        internalNode.toggleExpandCollapse();
        expandOrCollapseChildren(internalNode, treeMap, keyPropertyName);
        treeMap.set(key, internalNode);
      }
      const updatedNodes = nodes.concat([]);
      setNodes(updatedNodes);
      setTreeMap(treeMap);
    }
  };

  const reset = () => {
    setNodes([]);
    setTreeMap(new Map());
  };

  const internalCollectionProps = {
    ...collectionProps,
    sorting: undefined, // disable useCollection sort in favor of sortTree
    filtering: {
      ...(collectionProps.filtering || {}),
      filteringFunction: (item: ITreeNode<T>, filteringText: string, filteringFields?: string[]) =>
        filteringFunction(item, filteringText, filteringFields, collectionProps.filtering?.filteringFunction),
    },
  };

  useEffect(() => {
    if (expanded) {
      const newNodesExpanded: { [key: string]: boolean } = {};

      nodes.forEach((node) => {
        if (!nodesExpanded[node.id]) {
          if (!node.isExpanded()) {
            node.toggleExpandCollapse();
          }
          node.setVisible(true);
          newNodesExpanded[node.id] = true;
        }
      });

      if (Object.keys(newNodesExpanded).length > 0) {
        addNodesExpanded({ ...nodesExpanded, ...newNodesExpanded });
      }
    }
  }, [nodesExpanded, nodes, expanded]);

  const collectionResult = useCollection(nodes, internalCollectionProps);
  const useCollectionResult = {
    ...collectionResult,
    collectionProps: {
      ...collectionResult.collectionProps,
      sortingColumn: sortState.sortingColumn,
      sortingDescending: sortState.isDescending,
      onSortingChange: (event: CustomEvent<TableProps.SortingState<T>>) => {
        setSortState(event.detail);
        const customOnSortingChange = collectionResult.collectionProps.onSortingChange;
        if (customOnSortingChange) {
          customOnSortingChange(event);
        }
      },
    },
  } as UseCollectionResult<ITreeNode<T>>;

  return {
    expandNode,
    reset,
    ...useCollectionResult,
  };
};
