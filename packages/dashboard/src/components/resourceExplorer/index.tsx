import React, { useState, useEffect } from 'react';
import { ErrorDetails, TreeProvider, TreeQuery } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';
import { SiteWiseAssetResource, FilterTexts, ColumnDefinition } from './types';
import { parseSitewiseAssetTree } from './utils';
import {
  EmptyStateProps,
  RelatedTable,
  withUseTreeCollection,
  UseTreeCollection,
  ITreeNode,
} from '@iot-app-kit/related-table';
import { TableProps } from '@awsui/components-react/table';
import { NonCancelableCustomEvent } from '@awsui/components-react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_COLUMNS: ColumnDefinition<SiteWiseAssetResource>[] = [
  {
    sortingField: 'name',
    id: 'name',
    header: 'Asset Name',
    cell: ({ name }: SiteWiseAssetResource) => name,
  },
  {
    sortingField: 'status',
    id: 'status',
    header: 'Status',
    cell: ({ status }: SiteWiseAssetResource) => status?.state,
  },
  {
    sortingField: 'creationDate',
    id: 'creationDate',
    header: 'Created',
    cell: ({ creationDate }: SiteWiseAssetResource) => creationDate?.toUTCString(),
  },
  {
    sortingField: 'lastUpdateDate',
    id: 'lastUpdateDate',
    header: 'Updated',
    cell: ({ lastUpdateDate }: SiteWiseAssetResource) => lastUpdateDate?.toUTCString(),
  },
];

const defaults = {
  selectionType: 'single' as TableProps.SelectionType,
  loadingText: 'loading...',
  filterText: {
    placeholder: 'Filter by name',
    empty: 'No assets found.',
    noMatch: `We can't find a match.`,
  },
  empty: {
    header: 'No assets',
    description: `You don't have any assets.`,
  },
};

export interface IotResourceExplorerProps {
  query: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
  columnDefinitions?: ColumnDefinition<any>[];
  filterTexts?: FilterTexts;
  selectionType?: TableProps.SelectionType;
  loadingText?: string;
  empty?: EmptyStateProps;
  filterEnabled?: boolean;
  sortingEnabled?: boolean;
  paginationEnabled?: boolean;
  wrapLines?: boolean;
  widgetId?: string;
  onSelectionChange?: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
  expanded?: boolean;
}

type ProviderStateValue = TreeProvider<SiteWiseAssetTreeNode[], BranchReference>;

const RelatedTableWithCollectionHooks = withUseTreeCollection(RelatedTable);

const makeExpandNodeFunction = (provider: any) => {
  return (node: ITreeNode<SiteWiseAssetResource>) => {
    node.hierarchies?.forEach((hierarchy: any) => {
      provider.expand(new BranchReference(node.id, hierarchy.id as string));
    });
  };
};

export const IotResourceExplorer = ({
  query,
  columnDefinitions = DEFAULT_COLUMNS,
  filterTexts,
  selectionType,
  loadingText,
  empty,
  filterEnabled = true,
  sortingEnabled = true,
  paginationEnabled = true,
  wrapLines = false,
  widgetId = uuidv4(),
  onSelectionChange,
  expanded = false,
}: IotResourceExplorerProps) => {
  const [provider, setProvider] = useState<ProviderStateValue | undefined>(undefined);
  const [items, setItems] = useState<SiteWiseAssetResource[]>([]);
  const [expandedItems, setExpandedItems] = useState<{ [id: string]: boolean }>({});
  const [errors, setErrors] = useState<ErrorDetails[]>([]);

  useEffect(() => {
    const nextProvider = query.build(widgetId);
    nextProvider.subscribe({
      next: (data: SiteWiseAssetTreeNode[]) => {
        setItems(parseSitewiseAssetTree(data));
      },
      error: (err: ErrorDetails[]) => {
        setErrors(err);
      },
    });

    setProvider(nextProvider);

    return () => {
      nextProvider.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!provider || !expanded) return;
    const newExpandedItems: { [id: string]: boolean } = {};

    items.forEach(({ id, hierarchies, hasChildren }) => {
      if (id && !expandedItems[id] && hasChildren) {
        hierarchies?.forEach((hierarchy: any) => {
          provider.expand(new BranchReference(id, hierarchy.id as string));
        });

        newExpandedItems[id] = true;
      }
    });

    setExpandedItems({ ...expandedItems, ...newExpandedItems });
  }, [items]);

  const filtering = filterEnabled ? filterTexts || defaults.filterText : undefined;

  const collectionOptions: UseTreeCollection<unknown> = {
    columnDefinitions: columnDefinitions,
    keyPropertyName: 'id',
    parentKeyPropertyName: 'parentId',
    selection: {
      keepSelection: true,
    },
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: 'name',
        },
        isDescending: true,
      },
    },
    filtering,
  };

  if (paginationEnabled) {
    collectionOptions.pagination = { pageSize: 20 };
  }

  const emptyContent =
    errors.length > 0 ? { header: 'Error', description: errors[errors.length - 1]?.msg } : empty || defaults.empty;

  return (
    <div className="iot-resource-explorer">
      <RelatedTableWithCollectionHooks
        items={items}
        collectionOptions={collectionOptions}
        columnDefinitions={columnDefinitions}
        selectionType={selectionType || defaults.selectionType}
        loadingText={loadingText || defaults.loadingText}
        filterPlaceholder={filtering?.placeholder}
        expandChildren={makeExpandNodeFunction(provider)}
        onSelectionChange={onSelectionChange}
        empty={emptyContent}
        sortingDisabled={!sortingEnabled}
        wrapLines={wrapLines}
        expanded={expanded}
      />
    </div>
  );
};
