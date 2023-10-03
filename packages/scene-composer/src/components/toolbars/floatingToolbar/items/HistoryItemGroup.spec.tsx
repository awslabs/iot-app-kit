import React from 'react';
import { create, act } from 'react-test-renderer';

import useDynamicScene from '../../../../hooks/useDynamicScene';
import { createUndoStore } from '../../../../store/middlewares';
import { useStore } from '../../../../store';

import { HistoryItemGroup } from './HistoryItemGroup';

jest.mock('../../common/ToolbarItem', () => ({
  ToolbarItem: 'ToolbarItem',
}));

jest.mock('../../../../hooks/useDynamicScene', () => jest.fn());

describe('HistoryItemGroup', () => {
  beforeEach(() => {
    (useDynamicScene as jest.Mock).mockReturnValue(false);
  });

  it('should render correctly with undo enabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });

    undoStore.setState({ prevStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with undo disabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });
    (useDynamicScene as jest.Mock).mockReturnValue(true);

    undoStore.setState({ prevStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo enabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });

    undoStore.setState({ futureStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo disabled', () => {
    const undoStore = createUndoStore();
    useStore('default').setState({ undoStore });
    (useDynamicScene as jest.Mock).mockReturnValue(true);

    undoStore.setState({ futureStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });
});
