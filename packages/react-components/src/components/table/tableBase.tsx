import React, { useState } from 'react';
import {
  Pagination,
  PropertyFilter,
  Table,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { getDefaultColumnDefinitions } from './tableHelpers';
import type { FunctionComponent } from 'react';
import type { TableItemHydrated, TableProps } from './types';
import { ASSISTANT_SELECTION_LIMITATION, DEFAULT_PAGE_SIZE } from './constants';

export const TableBase: FunctionComponent<TableProps> = (props) => {
  const {
    items: userItems,
    sorting = {},
    propertyFiltering,
    columnDefinitions: userColumnDefinitions,
    messageOverrides: { propertyFilter },
    precision,
    paginationEnabled,
    pageSize,
    empty,
  } = props;
  const [selectedItems, setSelectedItems] = useState<Array<TableItemHydrated>>(
    []
  );
  const { items, collectionProps, propertyFilterProps, paginationProps } =
    useCollection(userItems, {
      sorting,
      propertyFiltering,
      pagination: { pageSize: pageSize ?? DEFAULT_PAGE_SIZE },
    });
  const columnDefinitions = getDefaultColumnDefinitions(
    userColumnDefinitions,
    precision
  );
  const pagination = {
    ...(paginationEnabled && {
      pagination: <Pagination {...paginationProps} />,
    }),
  };

  return (
    <Table
      {...props}
      {...collectionProps}
      {...pagination}
      items={items}
      columnDefinitions={columnDefinitions}
      empty={empty}
      filter={
        propertyFiltering && (
          <PropertyFilter
            {...propertyFilterProps}
            expandToViewport
            i18nStrings={propertyFilter}
          />
        )
      }
      selectionType={props.assistant ? 'multi' : undefined}
      isItemDisabled={(item: TableItemHydrated) => {
        if (selectedItems.length === ASSISTANT_SELECTION_LIMITATION) {
          const found =
            selectedItems.find((i) => i.id === item.id) !== undefined;
          return !found;
        }

        return false;
      }}
      onSelectionChange={(event) => {
        setSelectedItems(event.detail.selectedItems);
        if (props.onTableSelection) {
          const indexesSelected = event.detail.selectedItems.map(
            (selectedItem) => {
              return items.findIndex((i) => i.id === selectedItem.id);
            }
          );
          props.onTableSelection(indexesSelected);
        }
      }}
      selectedItems={selectedItems}
      trackBy='id'
    />
  );
};
