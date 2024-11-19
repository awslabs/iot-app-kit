import { render } from '@/tests/testing-library';

import useDynamicScene from '../../../../hooks/useDynamicScene';
import { accessStore } from '../../../../store';
import { createUndoStore } from '../../../../store/middlewares';
import { ToolbarOrientation } from '../../common/types';

import { HistoryItemGroup } from './HistoryItemGroup';

vi.mock('../../common/ToolbarItem', () => ({
  ToolbarItem: 'ToolbarItem',
}));

vi.mock('../../../../hooks/useDynamicScene', () => ({ default: vi.fn() }));

describe('HistoryItemGroup', () => {
  beforeEach(() => {
    (useDynamicScene as vi.Mock).mockReturnValue(false);
  });

  it('should render correctly with undo enabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });

    undoStore.setState({ prevStates: [{}] });
    const { container } = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with undo disabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });
    (useDynamicScene as vi.Mock).mockReturnValue(true);

    undoStore.setState({ prevStates: [{}] });
    const { container } = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo enabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });

    undoStore.setState({ futureStates: [{}] });
    const { container } = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with redo disabled', () => {
    const undoStore = createUndoStore();
    accessStore('default').setState({ undoStore });
    (useDynamicScene as vi.Mock).mockReturnValue(true);

    undoStore.setState({ futureStates: [{}] });
    const { container } = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Vertical} />);
    expect(container).toMatchSnapshot();
  });

  it('should correctly render horizontally', async () => {
    const { container } = render(<HistoryItemGroup toolbarOrientation={ToolbarOrientation.Horizontal} />);

    expect(container).toMatchSnapshot();
  });
});
