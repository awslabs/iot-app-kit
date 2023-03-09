import { Header, StatusIndicator, StatusIndicatorProps } from '@awsui/components-react';
import React, { useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { RelatedTable, useTreeCollection } from '../src';

export default {
  title: 'Features/RelatedTable/AsyncData',
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

function genData() {
  return [
    {
      entityId: 'Building',
      status: { state: 'ACTIVE' },
    },
    {
      entityId: 'Office Space',
      parentId: 'Building',
      status: { state: 'ACTIVE' },
    },
    {
      entityId: 'Factory Space',
      parentId: 'Building',
      status: { state: 'ACTIVE' },
    },
    {
      entityId: 'Boiler_room_3',
      parentId: 'Building',
      status: { state: 'ACTIVE' },
    },
    {
      entityId: 'Equipment',
      status: { state: 'ERROR' },
    },
    {
      entityId: 'Cookie Production Line 1',
      parentId: 'Equipment',
      status: { state: 'ACTIVE' },
    },
    { entityId: 'Mixer', parentId: 'Cookie Production Line 1', status: { state: 'ACTIVE' } },
    { entityId: 'Pump', parentId: 'Mixer', status: { state: 'ACTIVE' } },
    { entityId: 'Motor_01', parentId: 'Mixer', status: { state: 'ACTIVE' } },
    { entityId: 'Motor_02', parentId: 'Mixer', status: { state: 'ACTIVE' } },
    { entityId: 'Motor_03', parentId: 'Mixer', status: { state: 'ACTIVE' } },
    {
      entityId: 'Cookie Production Line 2',
      parentId: 'Equipment',
      status: { state: 'ACTIVE' },
    },
  ];
}

function genDataAsync() {
  return Promise.resolve(genData());
}

export const AsyncData: Story = () => {
  const [allItems, setAllItems] = useState<any[]>([]);

  useEffect(() => {
    genDataAsync().then((data) => setAllItems(data));
  }, []);

  const columnDefinitions = [
    {
      id: 'entityId',
      header: 'Name',
      cell: (item: any) => item.entityId,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item: any) => {
        const currentState = item.status?.state || 'ERROR';
        const statusMap: { [key: string]: StatusIndicatorProps.Type } = {
          CREATING: 'in-progress',
          UPDATING: 'in-progress',
          DELETING: 'in-progress',
          ACTIVE: 'success',
          ERROR: 'error',
        };
        return <StatusIndicator type={statusMap[currentState]}>{currentState}</StatusIndicator>;
      },
    },
  ];
  const { expandNode, items, collectionProps } = useTreeCollection(allItems, {
    columnDefinitions,
    keyPropertyName: 'entityId',
    parentKeyPropertyName: 'parentId',
    sorting: {},
    selection: {
      trackBy: 'entityId',
    },
  });

  const { selectedItems } = collectionProps;

  return (
    <RelatedTable
      {...collectionProps}
      expandChildren={expandNode}
      trackBy='entityId'
      selectionType='single'
      columnDefinitions={columnDefinitions}
      items={items}
      header={
        <Header
          counter={selectedItems?.length ? `(${selectedItems.length}/${allItems.length})` : `(${allItems.length})`}
        >
          Entities
        </Header>
      }
    />
  );
};
