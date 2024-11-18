import { create, act } from 'react-test-renderer';
import { render } from '@testing-library/react';

import useDynamicScene from '../../../../hooks/useDynamicScene';
import { createUndoStore } from '../../../../store/middlewares';
import { accessStore } from '../../../../store';
import { ToolbarOrientation } from '../../common/types';

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
    accessStore('default').setState({ undoStore });

    undoStore.setState({ prevStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with undo disabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });
    (useDynamicScene as jest.Mock).mockReturnValue(true);

    undoStore.setState({ prevStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo enabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });

    undoStore.setState({ futureStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo disabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });
    (useDynamicScene as jest.Mock).mockReturnValue(true);

    undoStore.setState({ futureStates: [{}] });
    let container;
    act(() => {
      container = create(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should correctly render horizontally', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Horizontal} />);
      container = rendered.container;
    });

    expect(container).toMatchSnapshot();
  });
});
