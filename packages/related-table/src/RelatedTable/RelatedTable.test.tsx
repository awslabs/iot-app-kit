import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { RelatedTable } from './RelatedTable';
import { TreeNode, ITreeNode } from '../Model/TreeNode';
import { recursiveBuildTreePrefix } from '../utils';

const parentNode = new TreeNode({ name: 'Parent', id: 'parent' });
const childNode = new TreeNode({ name: 'Child', id: 'child' });
const node = new TreeNode({ name: 'Node', id: 'node' });
parentNode.getChildren().push(node);
node.setParentNode(parentNode);
node.getChildren().push(childNode);
childNode.setParentNode(node);
recursiveBuildTreePrefix(parentNode, 0, []);

const columnDefinitions = [
  {
    sortingField: 'name',
    id: 'name',
    header: 'Name',
    cell: ({ name }: any) => <div className="cell-content">{`${name}`}</div>,
  },
];

interface RenderComponentProps {
  items: ITreeNode<any>[];
  filteringText?: string;
  onExpandChildren?: (node: any) => void;
}

const RenderComponent = ({ items, filteringText, onExpandChildren }: RenderComponentProps) => {
  return render(
    <RelatedTable
      columnDefinitions={columnDefinitions}
      items={items}
      expandChildren={(treeNode: any) => {
        if (onExpandChildren) {
          onExpandChildren(treeNode);
        }
      }}
      selectionType="single"
      filteringText={filteringText}
    />
  );
};

it('list all items in the table correctly', () => {
  const { queryByText, container } = RenderComponent({ items: [parentNode, node, childNode] });
  expect(queryByText(parentNode.name)).not.toBe(null);
  expect(queryByText(node.name)).not.toBe(null);
  expect(queryByText(childNode.name)).not.toBe(null);
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toEqual(2);
});

it('expand button correctly', () => {
  const onExpandChildren = jest.fn();
  const { container } = RenderComponent({ items: [parentNode], onExpandChildren });

  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toEqual(1);

  act(() => {
    buttons[0]?.click();
  });

  expect(onExpandChildren).toHaveBeenCalled();
});

it('renders filter correctly', () => {
  const { queryByText } = RenderComponent({ items: [parentNode, node, childNode], filteringText: 'Child' });
  expect(queryByText(parentNode.name)).not.toBe(null);
  expect(queryByText(node.name)).not.toBe(null);
  expect(queryByText(childNode.name)).not.toBe(null);
});
