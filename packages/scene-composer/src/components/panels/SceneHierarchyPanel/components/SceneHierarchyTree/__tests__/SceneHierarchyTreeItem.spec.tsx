import React, { useCallback } from 'react';
import { render } from '@testing-library/react';

import { useSceneHierarchyData, useChildNodes } from '../../../SceneHierarchyDataProvider';
import SceneHierarchyTreeItem from '../SceneHierarchyTreeItem';

jest.mock('../../../../../../enhancers/draggable', () => (item: any) => item);
jest.mock('../../../../../../enhancers/droppable', () => (item: any) => item);
jest.mock('../../../SceneHierarchyDataProvider');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

describe('SceneHierarchyTreeItem', () => {
  const select = jest.fn();
  const unselect = jest.fn();
  const activate = jest.fn();
  const move = jest.fn();
  let callbacks: any[] = [];

  beforeEach(() => {
    callbacks = [];

    (useSceneHierarchyData as unknown as jest.Mock).mockImplementation(() => {
      return {
        selected: '1',
        select,
        unselect,
        activate,
        move,
        selectionMode: 'single',
      };
    });

    (useChildNodes as unknown as jest.Mock).mockImplementation(() => [[]]);

    (useCallback as jest.Mock).mockImplementation((cb) => callbacks.push(cb));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should unselect when toggled off', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />);

    const [, onToggle] = callbacks;

    onToggle(false);

    expect(unselect).toBeCalled();
    expect(select).not.toBeCalled();
  });

  it('should select when toggled on', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />);

    const [, onToggle] = callbacks;

    onToggle(true);

    expect(unselect).not.toBeCalled();
    expect(select).toBeCalled();
  });

  it('should bubble up when expanded', () => {
    const { container } = render(
      <SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} expanded={false} />,
    );

    const [onExpandNode] = callbacks;

    onExpandNode(true);
    expect(container).toMatchSnapshot();
  });

  it('should activate and select on activation', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />);

    const [, , onActivated] = callbacks;
    onActivated();

    expect(activate).toBeCalledWith('1');
    expect(select).toBeCalledWith('1');
  });

  it('should reparent item when dropped', () => {
    render(<SceneHierarchyTreeItem objectRef='1' name={'Label 1'} componentTypes={['modelRef']} />);

    const [, , , dropHandler] = callbacks;

    dropHandler({ ref: 'droppedItem' }, { beenHandled: false });

    expect(move).toBeCalledWith('droppedItem', '1');
  });
});
