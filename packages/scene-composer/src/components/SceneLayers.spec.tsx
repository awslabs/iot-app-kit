import * as React from 'react';
import { render } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import { useStore } from '../store';
import { processQueries } from '../utils/entityModelUtils/processQueries';

import { SceneLayers } from './SceneLayers';

jest.mock('../utils/entityModelUtils/processQueries', () => ({
  processQueries: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('SceneLayers', () => {
  const renderSceneNodesFromLayersMock = jest.fn();
  const isViewingMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const baseState = {
    getSceneProperty: getScenePropertyMock,
    renderSceneNodesFromLayers: renderSceneNodesFromLayersMock,
    isViewing: isViewingMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    isViewingMock.mockReturnValue(true);
    getScenePropertyMock.mockReturnValue(['layer1', 'layer2']);
  });

  it('should enable query when have layerId', async () => {
    useStore('default').setState(baseState);
    let enabledValue = false;
    (useQuery as jest.Mock).mockImplementation(({ enabled, ..._ }) => {
      enabledValue = enabled;
      return {};
    });

    render(<SceneLayers />);

    expect(enabledValue).toBe(true);
  });

  it('should not enable query when no layerId', async () => {
    useStore('default').setState(baseState);
    getScenePropertyMock.mockReturnValue([]);

    let enabledValue = true;
    (useQuery as jest.Mock).mockImplementation(({ enabled, ..._ }) => {
      enabledValue = enabled;
      return {};
    });

    render(<SceneLayers />);

    expect(enabledValue).toBe(false);
  });

  it('should not refetch when not in viewing mode', async () => {
    useStore('default').setState(baseState);
    isViewingMock.mockReturnValue(false);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: {} });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(0);
  });

  it('should not refetch when previous query failed', async () => {
    useStore('default').setState(baseState);
    isViewingMock.mockReturnValue(false);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: { error: 'error' } });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(0);
  });

  it('should refetch with expected interval', async () => {
    useStore('default').setState(baseState);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: {} });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(10 * 1000);
  });

  it('should call processQueries with expected data', async () => {
    useStore('default').setState(baseState);
    let queryFunction;
    (useQuery as jest.Mock).mockImplementation(({ queryFn, ..._ }) => {
      queryFunction = queryFn;
      return {};
    });

    render(<SceneLayers />);
    await queryFunction();

    expect(processQueries as jest.Mock).toBeCalledTimes(1);
    expect(processQueries as jest.Mock).toBeCalledWith(
      [expect.stringContaining("AND e.entityId = 'layer1'")],
      expect.anything(),
    );
    expect(renderSceneNodesFromLayersMock).not.toBeCalled();
  });

  it('should call processQueries with expected data', async () => {
    useStore('default').setState(baseState);
    let queryFunction;
    (useQuery as jest.Mock).mockImplementation(({ queryFn, ..._ }) => {
      queryFunction = queryFn;
      return { data: ['random'] };
    });

    render(<SceneLayers />);
    await queryFunction();

    expect(processQueries as jest.Mock).toBeCalledTimes(1);
    expect(renderSceneNodesFromLayersMock).toBeCalledTimes(1);
    expect(renderSceneNodesFromLayersMock).toBeCalledWith(['random'], 'layer1');
  });
});
