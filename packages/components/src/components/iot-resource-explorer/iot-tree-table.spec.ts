jest.mock('react-dom', () => ({
  render: jest.fn(),
}));

import { newSpecPage } from '@stencil/core/testing';
import { IotTreeTable } from './iot-tree-table';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import ReactDOM from 'react-dom';

const items = [
  {
    id: 'GrandParent',
    name: 'Grand Parent Name',
  },
  {
    parentId: 'GrandParent',
    id: 'Parent',
    name: 'Parent Name',
  },
  {
    parentId: 'Parent',
    id: 'Child',
    name: 'Child Name',
  },
  {
    parentId: 'Child',
    id: 'GrandChild',
    name: 'Grand Child Name',
  },
];

const columnDefinitions = [
  {
    sortingField: 'name',
    id: 'name',
    header: 'Name',
    cell: ({ name }: { name: string }) => name,
  },
];

const collectionOptions = {
  columnDefinitions,
  sorting: {
    defaultState: {
      sortingColumn: {
        sortingField: 'name',
      },
    },
  },
  pagination: { pageSize: 20 },
  keyPropertyName: 'id',
  parentKeyPropertyName: 'parentId',
  selection: {
    keepSelection: true,
  },
  filtering: {
    empty: 'No items found',
    noMatch: 'No items found',
  },
};

const treeTableSpecPage = async () => {
  const page = await newSpecPage({
    components: [IotTreeTable],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const treeTable = page.doc.createElement('iot-tree-table') as CustomHTMLElement<Components.IotTreeTable>;
  const props: Partial<Components.IotTreeTable> = {
    items,
    collectionOptions,
    columnDefinitions,
    selectionType: 'single',
  };
  update(treeTable, props);
  page.body.appendChild(treeTable);

  await page.waitForChanges();

  return { page, treeTable };
};

it('renders', async () => {
  await treeTableSpecPage();
  const elementCreated = (ReactDOM.render as jest.Mock).mock.calls[0][0];
  expect(elementCreated.props.items).toBe(items);
  expect(elementCreated.props.columnDefinitions).toBe(columnDefinitions);
  expect(elementCreated.props.collectionOptions).toBe(collectionOptions);
});
