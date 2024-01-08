import { Component, h, State } from '@stencil/core';
import { AssetSummary } from '@aws-sdk/client-iotsitewise';

interface Asset extends Partial<AssetSummary> {
  parentId: string;
  hasChildren?: true;
}

const allItems: Partial<Asset>[] = [
  {
    creationDate: new Date(1605316299000),
    id: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
    lastUpdateDate: new Date(1614904229000),
    name: 'Root Hierarchy',
    hasChildren: true,
    status: { state: 'ACTIVE' },
  },
  {
    creationDate: new Date(1617121611000),
    id: '0fe0238d-5704-4907-9f74-9ea3a2a41c9d',
    lastUpdateDate: new Date(1621547348000),
    name: 'zz_Asset_6016_of_10000',
    status: { state: 'ACTIVE' },
  },
  {
    creationDate: new Date(1617122142000),
    id: '4f037ba9-b002-4ab5-bd89-32b64425707a',
    lastUpdateDate: new Date(1621547370000),
    name: 'zz_Asset_7198_of_10000',
    status: { state: 'ACTIVE' },
  },
  {
    id: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    parentId: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
    name: 'hierarchy_1',
    creationDate: new Date(1605316100000),
    lastUpdateDate: new Date(1614904100000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '7e38bf23-a2e1-4fa7-8ba8-111111',
    parentId: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    name: 'hierarchy_2',
    creationDate: new Date(1605316202000),
    lastUpdateDate: new Date(1614904202000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '41043ebf-9912-412c-b4f9-5114e3',
    parentId: '7e38bf23-a2e1-4fa7-8ba8-111111',
    name: 'hierarchy_3',
    creationDate: new Date(1605316303000),
    lastUpdateDate: new Date(1614904303000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '41043ebf-9912-412c-b4f9-511tre',
    parentId: '41043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_4',
    creationDate: new Date(1605316404000),
    lastUpdateDate: new Date(1614904404000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '51043ebf-9912-412c-b4f9-511tre',
    parentId: '41043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_5',
    creationDate: new Date(1605316505000),
    lastUpdateDate: new Date(1614904505000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '61043ebf-9912-412c-b4f9-5114e3',
    parentId: '7e38bf23-a2e1-4fa7-8ba8-111111',
    name: 'hierarchy_6',
    creationDate: new Date(1605316606000),
    lastUpdateDate: new Date(1614904606000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '71043ebf-9912-412c-b4f9-511tre',
    parentId: '61043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_7',
    creationDate: new Date(1605316707000),
    lastUpdateDate: new Date(1614904707000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '81043ebf-9912-412c-b4f9-511tre',
    parentId: '61043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_8',
    creationDate: new Date(1605316808000),
    lastUpdateDate: new Date(1614904808000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '1038bf23-a2e1-4fa7-8ba8-1232313213',
    parentId: 'a044f631-ea39-4c2e-a8ef-631f1c0f4bc8',
    name: 'hierarchy_10',
    creationDate: new Date(1605316100000),
    lastUpdateDate: new Date(1614904100000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '1138bf23-a2e1-4fa7-8ba8-1232313213',
    parentId: '1038bf23-a2e1-4fa7-8ba8-1232313213',
    name: 'hierarchy_11',
    creationDate: new Date(1605316110000),
    lastUpdateDate: new Date(1614904110000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '1238bf23-a2e1-4fa7-8ba8-111111',
    parentId: '1138bf23-a2e1-4fa7-8ba8-1232313213',
    name: 'hierarchy_12',
    creationDate: new Date(1605316120000),
    lastUpdateDate: new Date(1614904120000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '13043ebf-9912-412c-b4f9-5114e3',
    parentId: '1238bf23-a2e1-4fa7-8ba8-111111',
    name: 'hierarchy_13',
    creationDate: new Date(1605316130000),
    lastUpdateDate: new Date(1614904130000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '14043ebf-9912-412c-b4f9-511tre',
    parentId: '13043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_14',
    creationDate: new Date(1605316140000),
    lastUpdateDate: new Date(1614904140000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '15043ebf-9912-412c-b4f9-511tre',
    parentId: '13043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_15',
    creationDate: new Date(1605316150000),
    lastUpdateDate: new Date(1614904150000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '16043ebf-9912-412c-b4f9-5114e3',
    parentId: '1238bf23-a2e1-4fa7-8ba8-111111',
    name: 'hierarchy_16',
    creationDate: new Date(1605316160000),
    lastUpdateDate: new Date(1614904160000),
    status: { state: 'ACTIVE' },
    hasChildren: true,
  },
  {
    id: '17043ebf-9912-412c-b4f9-511tre',
    parentId: '16043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_17',
    creationDate: new Date(1605316170000),
    lastUpdateDate: new Date(1614904170000),
    status: { state: 'ACTIVE' },
  },
  {
    id: '18043ebf-9912-412c-b4f9-511tre',
    parentId: '16043ebf-9912-412c-b4f9-5114e3',
    name: 'hierarchy_18',
    creationDate: new Date(1605316180000),
    lastUpdateDate: new Date(1614904180000),
    status: { state: 'ACTIVE' },
  },
];

const initial = allItems.filter((item) => !item.parentId);
const loaded = new Map<string, boolean>();

@Component({
  tag: 'iot-tree-table-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotTreeTableDemo {
  @State() selectItems: unknown[];
  @State() items: unknown[] = initial;

  columnDefinitions = [
    {
      sortingField: 'name',
      id: 'name',
      header: 'Name',
      cell: ({ name }: Asset) => name,
    },
    {
      sortingField: 'status',
      id: 'status',
      header: 'Status',
      cell: ({ status }: Asset) => status?.state,
    },
    {
      sortingField: 'creationDate',
      id: 'creationDate',
      header: 'Created',
      cell: ({ creationDate }: Asset) => creationDate?.toUTCString(),
    },
    {
      sortingField: 'lastUpdateDate',
      id: 'lastUpdateDate',
      header: 'Updated',
      cell: ({ lastUpdateDate }: Asset) => lastUpdateDate?.toUTCString(),
    },
  ];
  collectionOptions = {
    columnDefinitions: this.columnDefinitions,
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
  };
  filterPlaceholder = 'Filter by name';

  render() {
    return (
      <iot-tree-table
        items={this.items}
        collectionOptions={this.collectionOptions}
        columnDefinitions={this.columnDefinitions}
        selectionType='single'
        filterPlaceholder={this.filterPlaceholder}
        onExpandChildren={(node) => {
          if (!loaded.has(node.id)) {
            const newItems = allItems.filter(
              (item) => item.parentId === node.id
            );
            this.items = [...this.items, ...newItems];
          }
          loaded.set(node.id, true);
        }}
        onSelectionChange={(event) => {
          this.selectItems = event.detail.selectedItems;
        }}
      ></iot-tree-table>
    );
  }
}
