import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { useSceneHierarchyData, useChildNodes } from '../../SceneHierarchyDataProvider';
import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';

import SceneHierarchyTreeItem from './SceneHierarchyTreeItem';

jest.mock('../../../../../enhancers/draggable', () => (item: any) => item);
jest.mock('../../../../../enhancers/droppable', () => (item: any) => item);

jest.mock('../../SceneHierarchyDataProvider', () => ({
  useSceneHierarchyData: jest.fn(),
  useChildNodes: jest.fn(() => [[]]),
}));

describe('SceneHierarchyTreeItem', () => {
  it('should activate and select when activated', () => {
    const activateFn = jest.fn();
    const selectFn = jest.fn();

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        selected: new Set(),
        select: selectFn,
        unselect: jest.fn(),
        activate: activateFn,
        move: jest.fn(),
        selectionMode: 'single',
      };
    });

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />,
    );

    const triggerElement = container.querySelector('.tm-tree-item-inner');

    expect(triggerElement).not.toBeFalsy();

    if (triggerElement) {
      fireEvent.doubleClick(triggerElement);

      expect(activateFn).toBeCalledWith('1');
      expect(selectFn).toBeCalledWith('1');
    }
  });

  it('should select checked', () => {
    const selectFn = jest.fn();

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        selected: new Set(),
        select: selectFn,
        unselect: jest.fn(),
        activate: jest.fn(),
        move: jest.fn(),
        selectionMode: 'single',
      };
    });

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />,
    );

    const triggerElement = container.querySelector('[data-mocked="Checkbox"]');

    expect(triggerElement).not.toBeFalsy();

    if (triggerElement) {
      fireEvent.click(triggerElement);

      expect(selectFn).toBeCalledWith('1');
    }
  });

  it('should unselect items when selected item is clicked', () => {
    const unselectFn = jest.fn();

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        selected: new Set('1'),
        select: jest.fn(),
        unselect: unselectFn,
        activate: jest.fn(),
        move: jest.fn(),
        selectionMode: 'single',
      };
    });

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />,
    );

    const triggerElement = container.querySelector('[data-mocked="Checkbox"]');

    expect(triggerElement).not.toBeFalsy();

    if (triggerElement) {
      fireEvent.click(triggerElement);

      expect(unselectFn).toBeCalledWith('1');
    }
  });

  it('should show children when expanded', () => {
    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        selected: new Set(),
        select: jest.fn(),
        unselect: jest.fn(),
        activate: jest.fn(),
        move: jest.fn(),
        selectionMode: 'single',
      };
    });

    (useChildNodes as unknown as jest.Mock).mockImplementationOnce(() => [
      [
        { objectRef: '1' } as ISceneHierarchyNode,
        { objectRef: '2' } as ISceneHierarchyNode,
        { objectRef: '3' } as ISceneHierarchyNode,
        { objectRef: '4' } as ISceneHierarchyNode,
      ],
      false,
    ]);

    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />,
    );

    expect(container).toMatchSnapshot();
  });
});
