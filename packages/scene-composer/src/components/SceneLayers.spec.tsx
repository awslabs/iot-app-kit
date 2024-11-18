/* eslint-disable */
import { render } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import { accessStore } from '../store';
import { processQueries } from '../utils/entityModelUtils/processQueries';
import { KnownSceneProperty } from '../interfaces';
import { LAYER_DEFAULT_REFRESH_INTERVAL } from '../utils/entityModelUtils/sceneLayerUtils';
import { SceneLayers } from './SceneLayers';

jest.mock('../utils/entityModelUtils/processQueries', () => ({
  processQueries: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('SceneLayers', () => {
  const renderSceneNodesMock = jest.fn();
  const isViewingMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const baseState = {
    getSceneProperty: getScenePropertyMock,
    renderSceneNodes: renderSceneNodesMock,
    isViewing: isViewingMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    isViewingMock.mockReturnValue(true);
    getScenePropertyMock.mockImplementation((name) => {
      if (name === KnownSceneProperty.LayerIds) {
        return ['layer1', 'layer2'];
      } else if (name === KnownSceneProperty.LayerDefaultRefreshInterval) {
        return LAYER_DEFAULT_REFRESH_INTERVAL;
      }
    });
  });

  it('should enable query even no layerId specified', async () => {
    accessStore('default').setState(baseState);
    getScenePropertyMock.mockReturnValue([]);

    let enabledValue = true;
    (useQuery as jest.Mock).mockImplementation(({ enabled, ..._ }) => {
      enabledValue = enabled;
      return {};
    });

    render(<SceneLayers />);

    expect(enabledValue).toBe(true);
  });

  it('should not refetch when not in viewing mode', async () => {
    accessStore('default').setState(baseState);
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
    accessStore('default').setState(baseState);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: { error: 'error' } });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(0);
  });

  it('should not refetch when refresh interval set to 0', async () => {
    getScenePropertyMock.mockImplementation((name) => {
      if (name === KnownSceneProperty.LayerIds) {
        return ['layer1', 'layer2'];
      } else if (name === KnownSceneProperty.LayerDefaultRefreshInterval) {
        return 0;
      }
    });

    accessStore('default').setState(baseState);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: {} });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(0);
  });

  it('should refetch with expected interval', async () => {
    accessStore('default').setState(baseState);
    let interval;
    (useQuery as jest.Mock).mockImplementation(({ refetchInterval, ..._ }) => {
      interval = refetchInterval(undefined, { state: {} });
      return {};
    });

    render(<SceneLayers />);

    expect(interval).toBe(LAYER_DEFAULT_REFRESH_INTERVAL);
  });

  it('should call processQueries with expected data', async () => {
    accessStore('default').setState(baseState);
    let queryFunction;
    (useQuery as jest.Mock).mockImplementation(({ queryFn, ..._ }) => {
      queryFunction = queryFn;
      return {};
    });

    render(<SceneLayers />);
    await queryFunction();

    expect(processQueries as jest.Mock).toBeCalledTimes(1);
    expect(renderSceneNodesMock).not.toBeCalled();
  });

  it('should call processQueries with expected data', async () => {
    accessStore('default').setState(baseState);
    let queryFunction;
    (useQuery as jest.Mock).mockImplementation(({ queryFn, ..._ }) => {
      queryFunction = queryFn;
      return { data: ['random'] };
    });

    render(<SceneLayers />);
    await queryFunction();

    expect(processQueries as jest.Mock).toBeCalledTimes(1);
    expect(renderSceneNodesMock).toBeCalledTimes(1);
    expect(renderSceneNodesMock).toBeCalledWith(['random']);
  });
});
