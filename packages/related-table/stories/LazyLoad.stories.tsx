import { Header } from '@awsui/components-react';
import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ITreeNode, RelatedTable, useTreeCollection } from '../src';

export default {
  title: 'Features/RelatedTable/LazyLoad',
  component: RelatedTable,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const genLazyLoadData = (parent?: any, qty = 2) => {
  const seeds = [
    {
      id: 'item1',
      name: 'Item 1',
      hasChildren: true,
    },
    {
      id: 'item2',
      name: 'Item 2',
      hasChildren: true,
    },
    {
      id: 'item3',
      name: 'Item 3',
      hasChildren: false,
    },
  ];
  if (parent) {
    return new Array(qty).fill(0).map((_empty, index) => ({
      parentId: parent.id,
      id: `${parent.id}${index}`,
      name: `${parent.name} ${index}`,
      hasChildren: true,
    }));
  }
  return seeds;
};

export const LazyLoad: Story = () => {
  const [allItems, setAllItems] = useState<any[]>(genLazyLoadData());
  const [lazyLoadedMap, setLazyLoadedMap] = useState<Map<string, boolean>>(new Map());

  const columnDefinitions = [
    {
      id: 'name',
      header: 'Name',
      cell: (item: any) => {
        return <div>{item.name}</div>;
      },
    },
  ];
  const { expandNode, items, collectionProps } = useTreeCollection(allItems, {
    columnDefinitions,
    keyPropertyName: 'id',
    parentKeyPropertyName: 'parentId',
    sorting: {},
    selection: {
      keepSelection: true,
      trackBy: 'id',
    },
  });

  const onExpandChildren = async (node: ITreeNode<any>) => {
    expandNode(node);
    if (!lazyLoadedMap.get(node.id) && node.hasChildren) {
      const children = genLazyLoadData(node);
      lazyLoadedMap.set(node.id, true);
      setAllItems(allItems.concat(children));
      setLazyLoadedMap(lazyLoadedMap);
    }
  };

  const { selectedItems } = collectionProps;
  return (
    <RelatedTable
      {...collectionProps}
      expandChildren={onExpandChildren}
      trackBy='id'
      selectionType='single'
      columnDefinitions={columnDefinitions}
      items={items}
      header={
        <Header
          counter={selectedItems?.length ? `(${selectedItems.length}/${allItems.length})` : `(${allItems.length})`}
        >
          Assets
        </Header>
      }
    />
  );
};
