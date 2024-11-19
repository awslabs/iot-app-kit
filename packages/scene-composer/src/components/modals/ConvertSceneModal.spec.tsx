import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { act, render, waitFor } from '@/tests/testing-library';
import flushPromises from 'flush-promises';

import { defaultNode } from '../../../__mocks__/sceneNode';
import { setFeatureConfig, setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { KnownSceneProperty } from '../../interfaces';
import { accessStore } from '../../store';
import {
  checkIfEntityExists,
  convertAllNodesToEntities,
  createSceneRootEntity,
  prepareWorkspace,
  updateSceneRootEntity,
} from '../../utils/entityModelUtils/sceneUtils';

import ConvertSceneModal from './ConvertSceneModal';

vi.mock('../../utils/entityModelUtils/sceneUtils', () => ({
  createSceneRootEntity: vi.fn(),
  updateSceneRootEntity: vi.fn(),
  prepareWorkspace: vi.fn(),
  checkIfEntityExists: vi.fn(),
  convertAllNodesToEntities: vi.fn(),
}));

describe('ConvertSceneModal', () => {
  const setConvertSceneModalVisibility = vi.fn();
  const setSceneProperty = vi.fn();
  const updateSceneNodeInternalBatch = vi.fn();
  const getObject3DBySceneNodeRef = vi.fn();
  const getSceneProperty = vi.fn();
  const updateSceneInfo = vi.fn();
  const getSceneInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    accessStore('default').setState({
      document: {
        nodeMap: {
          'test-uuid': 'mockNode',
          'test-uuid2': 'mockNode2',
        },
      } as any,
      setConvertSceneModalVisibility,
      setSceneProperty,
      updateSceneNodeInternalBatch,
      getObject3DBySceneNodeRef,
      getSceneProperty,
    });
    (createSceneRootEntity as vi.Mock).mockImplementation(() => {
      return Promise.resolve({ entityId: 'scene-root-id' });
    });
    (updateSceneRootEntity as vi.Mock).mockResolvedValue({});
    (prepareWorkspace as vi.Mock).mockResolvedValue(undefined);

    getSceneProperty.mockImplementation((p) => {
      if (p == KnownSceneProperty.SceneRootEntityId) {
        return 'scene-root-id';
      } else {
        return undefined;
      }
    });

    (checkIfEntityExists as vi.Mock).mockReturnValue(true);

    setTwinMakerSceneMetadataModule({
      getSceneId: vi.fn().mockReturnValue('test-scene'),
      getSceneInfo,
      updateSceneInfo,
    } as Partial<TwinMakerSceneMetadataModule> as TwinMakerSceneMetadataModule);
    setFeatureConfig({});
    getSceneInfo.mockResolvedValue({});
    updateSceneInfo.mockResolvedValue({});
  });

  it('should render with correct confirmation view', () => {
    const { container, queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    const cancelButton = queryByTestId('cancel-button');

    expect(confirmButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(container).toMatchSnapshot();

    act(() => {
      cancelButton!.click();
    });

    expect(setConvertSceneModalVisibility).toBeCalledWith(false);
  });

  it('should call prepareWorkspace when converting scene', async () => {
    const { container, queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();
    expect(container).toMatchSnapshot();
    expect(queryByTestId('confirm-button')?.getAttribute('disabled')).not.toBeNull();

    expect(prepareWorkspace).toBeCalledTimes(1);
    expect(createSceneRootEntity as vi.Mock).not.toBeCalled();
    expect(setSceneProperty).not.toBeCalled();
  });

  it('should create a root entity when none available', async () => {
    getSceneProperty.mockReturnValue(undefined);
    const { queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(createSceneRootEntity as vi.Mock).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledWith(KnownSceneProperty.SceneRootEntityId, 'scene-root-id');
  });

  it('should create a default scene entity when it does not exist', async () => {
    (checkIfEntityExists as vi.Mock).mockImplementation((entityId) => {
      if (entityId == 'scene-root-id') {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    });

    const { queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(createSceneRootEntity as vi.Mock).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledWith(KnownSceneProperty.SceneRootEntityId, 'scene-root-id');
  });

  it('should call convertAllNodesToEntities and convert scene successfully', async () => {
    (convertAllNodesToEntities as vi.Mock).mockImplementation(({ onSuccess }) => {
      act(() => {
        onSuccess({ ...defaultNode, ref: 'success-1' });
        onSuccess({ ...defaultNode, ref: 'success-2' });
      });
    });

    const { rerender, container, queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(convertAllNodesToEntities).toBeCalledTimes(1);
    expect(updateSceneNodeInternalBatch).toBeCalledTimes(1);
    expect(updateSceneNodeInternalBatch).toBeCalledWith(
      { 'success-1': { ...defaultNode, ref: 'success-1' }, 'success-2': { ...defaultNode, ref: 'success-2' } },
      false,
      true,
    );

    act(() => {
      rerender(<ConvertSceneModal />);
    });

    const okButton = queryByTestId('ok-button');
    expect(okButton).toBeTruthy();

    expect(container).toMatchSnapshot();

    act(() => {
      okButton!.click();
    });
    expect(setConvertSceneModalVisibility).toBeCalledTimes(1);
    expect(setConvertSceneModalVisibility).toBeCalledWith(false);
  });

  it('should render with converting scene failure', async () => {
    (convertAllNodesToEntities as vi.Mock).mockImplementation(({ onSuccess, onFailure }) => {
      act(() => {
        onSuccess({ ...defaultNode, ref: 'success-node-ref' });
        onFailure({ ...defaultNode, ref: 'failure-node-ref', name: 'failure-node' }, new Error('convert failed'));
      });
    });

    const { rerender, container, queryByTestId, queryByText } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(convertAllNodesToEntities).toBeCalledTimes(1);
    expect(updateSceneNodeInternalBatch).toBeCalledTimes(1);
    expect(updateSceneNodeInternalBatch).toBeCalledWith(
      { 'success-node-ref': { ...defaultNode, ref: 'success-node-ref' } },
      false,
      true,
    );

    act(() => {
      rerender(<ConvertSceneModal />);
    });

    const errorMessage = queryByText('failure-node');
    waitFor(() => expect(errorMessage).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it('should render with preparing workspace failure', async () => {
    (prepareWorkspace as vi.Mock).mockRejectedValue(new Error('prepare workspace error'));
    const { rerender, container, queryByTestId, queryByText } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(convertAllNodesToEntities).not.toBeCalled();
    expect(updateSceneNodeInternalBatch).not.toBeCalled();

    act(() => {
      rerender(<ConvertSceneModal />);
    });

    const errorMessage = queryByText('prepare workspace error');
    expect(errorMessage).toBeTruthy();

    expect(container).toMatchSnapshot();
  });

  it('should convert empty scene successfully', async () => {
    accessStore('default').setState({
      document: {
        nodeMap: {},
      } as any,
    });

    getSceneProperty.mockReturnValue(undefined);
    const { queryByTestId } = render(<ConvertSceneModal />);

    const confirmButton = queryByTestId('confirm-button');
    act(() => {
      confirmButton!.click();
    });

    await flushPromises();

    expect(createSceneRootEntity as vi.Mock).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty).toBeCalledWith(KnownSceneProperty.SceneRootEntityId, 'scene-root-id');
    expect(convertAllNodesToEntities).not.toBeCalled();
  });
});
