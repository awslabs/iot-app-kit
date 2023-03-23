/* eslint-disable import/first */
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { HistoryItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { useStore } from '../../../../../src/store';
import { createUndoStore } from '../../../../../src/store/middlewares';

jest.mock('../../../../../src/components/toolbars/common/ToolbarItem', () => ({
  ToolbarItem: 'ToolbarItem',
}));

describe('HistoryItemGroup', () => {
  it('should render correctly with undo enabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });

    undoStore.setState({ prevStates: [{}] });
    let container;
    act(() => {
      container = renderer.create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo enabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });

    undoStore.setState({ futureStates: [{}] });
    let container;
    act(() => {
      container = renderer.create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });
});
