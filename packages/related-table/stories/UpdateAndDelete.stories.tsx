import { Button, Header, Pagination, TextFilter } from '@awsui/components-react';
import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { RelatedTable, useTreeCollection } from '../src';

export default {
  title: 'Features/RelatedTable/UpdateAndDelete',
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
      arn: 'arn:aws:iotsitewise:us-east-1:956523055275:asset/a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
      assetModelId: 'ae65323e-6778-420b-ac1' + 'a-eff7a8950300',
      creationDate: 1605316299,
      id: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
      lastUpdateDate: 1614904229,
      name: 'Alarm parent asset',
      status: 'ACTIVE',
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:956523055275:asset/0fe0238d-5704-4907-9f74-9ea3a2a41c9d',
      assetModelId: '1b2890d5-88cb-4869-9e93-6e2e0a6407bd',
      creationDate: 1617121611,
      id: '0fe0238d-5704-4907-9f74-9ea3a2a41c9d',
      lastUpdateDate: 1621547348,
      name: 'zz_Asset_6016_of_10000',
      status: 'FAILED',
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:956523055275:asset/4f037ba9-b002-4ab5-bd89-32b64425707a',
      assetModelId: '1b2890d5-88cb-4869-9e93-6e2e0a6407bd',
      creationDate: 1617122142,
      id: '4f037ba9-b002-4ab5-bd89-32b64425707a',
      lastUpdateDate: 1621547370,
      name: 'zz_Asset_7198_of_10000',
      status: 'FAILED',
    },
    {
      id: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
      parentId: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
      name: 'hierarchy_1',
      creationDate: 1605316100,
      lastUpdateDate: 1614904100,
      status: 'ACTIVE',
    },
    {
      id: '7e38bf23-a2e1-4fa7-8ba8-111111',
      parentId: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
      name: 'hierarchy_2',
      creationDate: 1605316202,
      lastUpdateDate: 1614904202,
      status: 'ACTIVE',
    },
    {
      id: '41043ebf-9912-412c-b4f9-5114e3',
      parentId: '7e38bf23-a2e1-4fa7-8ba8-111111',
      name: 'hierarchy_3',
      creationDate: 1605316303,
      lastUpdateDate: 1614904303,
      status: 'ACTIVE',
    },
    {
      id: '41043ebf-9912-412c-b4f9-511tre',
      parentId: '41043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_4',
      creationDate: 1605316404,
      lastUpdateDate: 1614904404,
      status: 'ACTIVE',
    },
    {
      id: '51043ebf-9912-412c-b4f9-511tre',
      parentId: '41043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_5',
      creationDate: 1605316505,
      lastUpdateDate: 1614904505,
      status: 'ACTIVE',
    },
    {
      id: '61043ebf-9912-412c-b4f9-5114e3',
      parentId: '7e38bf23-a2e1-4fa7-8ba8-111111',
      name: 'hierarchy_6',
      creationDate: 1605316606,
      lastUpdateDate: 1614904606,
      status: 'ACTIVE',
    },
    {
      id: '71043ebf-9912-412c-b4f9-511tre',
      parentId: '61043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_7',
      creationDate: 1605316707,
      lastUpdateDate: 1614904707,
      status: 'ACTIVE',
    },
    {
      id: '81043ebf-9912-412c-b4f9-511tre',
      parentId: '61043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_8',
      creationDate: 1605316808,
      lastUpdateDate: 1614904808,
      status: 'ACTIVE',
    },
    {
      id: '1038bf23-a2e1-4fa7-8ba8-1232313213',
      parentId: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
      name: 'hierarchy_10',
      creationDate: 1605316100,
      lastUpdateDate: 1614904100,
      status: 'ACTIVE',
    },
    {
      id: '1138bf23-a2e1-4fa7-8ba8-1232313213',
      parentId: '1038bf23-a2e1-4fa7-8ba8-1232313213',
      name: 'hierarchy_11',
      creationDate: 1605316110,
      lastUpdateDate: 1614904110,
      status: 'ACTIVE',
    },
    {
      id: '1238bf23-a2e1-4fa7-8ba8-111111',
      parentId: '1138bf23-a2e1-4fa7-8ba8-1232313213',
      name: 'hierarchy_12',
      creationDate: 1605316120,
      lastUpdateDate: 1614904120,
      status: 'ACTIVE',
    },
    {
      id: '13043ebf-9912-412c-b4f9-5114e3',
      parentId: '1238bf23-a2e1-4fa7-8ba8-111111',
      name: 'hierarchy_13',
      creationDate: 1605316130,
      lastUpdateDate: 1614904130,
      status: 'ACTIVE',
    },
    {
      id: '14043ebf-9912-412c-b4f9-511tre',
      parentId: '13043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_14',
      creationDate: 1605316140,
      lastUpdateDate: 1614904140,
      status: 'ACTIVE',
    },
    {
      id: '15043ebf-9912-412c-b4f9-511tre',
      parentId: '13043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_15',
      creationDate: 1605316150,
      lastUpdateDate: 1614904150,
      status: 'ACTIVE',
    },
    {
      id: '16043ebf-9912-412c-b4f9-5114e3',
      parentId: '1238bf23-a2e1-4fa7-8ba8-111111',
      name: 'hierarchy_16',
      creationDate: 1605316160,
      lastUpdateDate: 1614904160,
      status: 'ACTIVE',
    },
    {
      id: '17043ebf-9912-412c-b4f9-511tre',
      parentId: '16043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_17',
      creationDate: 1605316170,
      lastUpdateDate: 1614904170,
      status: 'ACTIVE',
    },
    {
      id: '18043ebf-9912-412c-b4f9-511tre',
      parentId: '16043ebf-9912-412c-b4f9-5114e3',
      name: 'hierarchy_18',
      creationDate: 1605316180,
      lastUpdateDate: 1614904180,
      status: 'ACTIVE',
    },
  ];
}

export const UpdateAndDelete: Story = () => {
  const [allItems, setAllItems] = useState<any[]>(genData());
  const [selectedItems, setSelectedItems] = useState<any[]>();
  const columnDefinitions = [
    {
      sortingField: 'name',
      id: 'name',
      header: 'Name',
      cell: (item: any) => <div>{item.name}</div>,
    },
    {
      sortingField: 'status',
      id: 'status',
      header: 'Status',
      cell: (item: any) => <div>{item.status}</div>,
    },
    {
      sortingField: 'creationDate',
      id: 'creationDate',
      header: 'Created',
      cell: (item: any) => <div>{new Date(item.creationDate * 1000).toUTCString()}</div>,
    },
    {
      sortingField: 'lastUpdateDate',
      id: 'lastUpdateDate',
      header: 'Updated',
      cell: (item: any) => <div>{new Date(item.lastUpdateDate * 1000).toUTCString()}</div>,
    },
  ];

  const { expandNode, items, collectionProps, filterProps, paginationProps, reset } = useTreeCollection(allItems, {
    columnDefinitions,
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: 'name',
        },
        isDescending: true,
      },
    },
    pagination: { pageSize: 20 },
    keyPropertyName: 'id',
    parentKeyPropertyName: 'parentId',
    selection: {
      keepSelection: true,
      trackBy: 'id',
    },
    filtering: {
      empty: 'No items found',
      noMatch: 'No items found',
    },
  });

  return (
    <RelatedTable
      {...filterProps}
      {...collectionProps}
      expandChildren={expandNode}
      trackBy='id'
      selectionType='single'
      columnDefinitions={columnDefinitions}
      items={items}
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) => {
        setSelectedItems(detail.selectedItems);
      }}
      header={
        <Header
          counter={`(${allItems.length})`}
          actions={
            <>
              <Button
                iconName='close'
                onClick={() => {
                  const updatedItems: any[] = [];
                  allItems.forEach((item) => {
                    if (!selectedItems?.some((selected) => selected.id === item.id)) {
                      updatedItems.push(item);
                    }
                  });
                  setAllItems(updatedItems);
                }}
              >
                Delete
              </Button>
              <span> &nbsp; </span>
              <Button
                iconName='refresh'
                onClick={() => {
                  reset();
                  setAllItems(genData());
                  setSelectedItems([]);
                }}
              >
                Reset
              </Button>
            </>
          }
        >
          Assets
        </Header>
      }
      filter={<TextFilter {...filterProps} />}
      pagination={<Pagination {...paginationProps} />}
    />
  );
};
