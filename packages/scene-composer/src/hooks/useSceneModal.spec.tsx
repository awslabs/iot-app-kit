import { renderHook } from '@/tests/testing-library';

import { accessStore } from '../store';

import useSceneModal from './useSceneModal';

vi.mock('../components/modals/MessageModal', () => ({ default: 'MessageModal' }));
vi.mock('../components/modals/ConvertSceneModal', () => ({ default: 'ConvertSceneModal' }));
vi.mock('../components/modals/DeleteNodeModal', () => ({ default: 'DeleteNodeModal' }));
vi.mock('../components/modals/DeleteComponentModal', () => ({ default: 'DeleteComponentModal' }));

describe('useSceneModal() hook', () => {
  const baseState = {
    getMessages: vi.fn(),
    isViewing: vi.fn(),
    convertSceneModalVisible: false,
    deleteConfirmationModalVisible: false,
    deleteConfirmationModalParams: undefined,
  };

  beforeEach(() => {
    baseState.getMessages.mockReturnValue([]);
  });

  it('should render with no modal', () => {
    accessStore('default').setState(baseState);

    const { result } = renderHook(() => useSceneModal());

    expect(result).toMatchSnapshot();
  });

  it('should render with message modal', () => {
    baseState.getMessages.mockReturnValue(['message']);

    const { result } = renderHook(() => useSceneModal());

    expect(result).toMatchSnapshot();
  });

  it('should render with convert scene modal', () => {
    accessStore('default').setState({
      ...baseState,
      convertSceneModalVisible: true,
    });

    const { result } = renderHook(() => useSceneModal());

    expect(result).toMatchSnapshot();
  });

  it('should render with delete node modal', () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalVisible: true,
      deleteConfirmationModalParams: {
        type: 'deleteNode',
        nodeRef: 'delete-node-ref',
      },
    });

    const { result } = renderHook(() => useSceneModal());

    expect(result).toMatchSnapshot();
  });

  it('should render with delete component modal', () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalVisible: true,
      deleteConfirmationModalParams: {
        type: 'deleteComponent',
        nodeRef: 'delete-component-ref',
        componentRef: 'comp-ref',
      },
    });

    const { result } = renderHook(() => useSceneModal());

    expect(result).toMatchSnapshot();
  });
});
