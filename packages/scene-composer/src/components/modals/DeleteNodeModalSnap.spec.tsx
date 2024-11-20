import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { act, render } from '@/tests/testing-library';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { accessStore } from '../../store';

import DeleteNodeModal from './DeleteNodeModal';

vi.mock('./DeleteConfirmationModal', () => ({ default: (props) => <div>{Object.values(props)}</div> }));

describe('DeleteNodeModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: vi.fn(),
    getSceneNodeByRef: vi.fn().mockReturnValue({ name: 'delete-node-name' }),
    removeSceneNode: vi.fn(),
  };
  const mockKGModule = {
    executeQuery: vi.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setTwinMakerSceneMetadataModule({ kgModule: mockKGModule } as unknown as TwinMakerSceneMetadataModule);
  });

  it('should render correctly for loading status', () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-1',
      },
    });

    const { container } = render(<DeleteNodeModal />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly when query returns error', async () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-1',
      },
    });
    mockKGModule.executeQuery.mockRejectedValue(new Error('faield query'));

    let container;
    await act(async () => {
      container = render(<DeleteNodeModal />).container;
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when query returns invalid number', async () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-1',
      },
    });
    mockKGModule.executeQuery.mockResolvedValue({ rows: [{}] });

    let container;
    await act(async () => {
      container = render(<DeleteNodeModal />).container;
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when query returns 0 children', async () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-1',
      },
    });
    mockKGModule.executeQuery.mockResolvedValue({ rows: [{ rowData: [0] }] });

    let container;
    await act(async () => {
      container = render(<DeleteNodeModal />).container;
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when query returns 1 children', async () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-1',
      },
    });
    mockKGModule.executeQuery.mockResolvedValue({ rows: [{ rowData: [1] }] });

    let container;
    await act(async () => {
      container = render(<DeleteNodeModal />).container;
    });

    expect(container).toMatchSnapshot();
  });
});
