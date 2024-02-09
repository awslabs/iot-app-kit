import React from 'react';
import { act, render } from '@testing-library/react';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { useStore } from '../../store';
import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';

import DeleteNodeModal from './DeleteNodeModal';

jest.mock('./DeleteConfirmationModal', () => (props) => <div>{Object.values(props)}</div>);

describe('DeleteNodeModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: jest.fn(),
    getSceneNodeByRef: jest.fn().mockReturnValue({ name: 'delete-node-name' }),
    removeSceneNode: jest.fn(),
  };
  const mockKGModule = {
    executeQuery: jest.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setTwinMakerSceneMetadataModule({ kgModule: mockKGModule } as unknown as TwinMakerSceneMetadataModule);
  });

  it('should render correctly for loading status', () => {
    useStore('default').setState({
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
    useStore('default').setState({
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
    useStore('default').setState({
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
    useStore('default').setState({
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
    useStore('default').setState({
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
