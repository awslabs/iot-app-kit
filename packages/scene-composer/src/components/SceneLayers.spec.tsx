/* eslint-disable */
import * as React from 'react';
import { render } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import { getGlobalSettings } from '../common/GlobalSettings';
import { accessStore } from '../store';
import { processQueries } from '../utils/entityModelUtils/processQueries';
import { checkIfEntityExists } from '../utils/entityModelUtils/sceneUtils';
import { KnownSceneProperty } from '../interfaces';
import { LAYER_DEFAULT_REFRESH_INTERVAL } from '../utils/entityModelUtils/sceneLayerUtils';
import { SceneLayers } from './SceneLayers';

jest.mock('../utils/entityModelUtils/processQueries', () => ({
  processQueries: jest.fn(),
}));

jest.mock('../utils/entityModelUtils/sceneUtils', () => ({
  ... jest.requireActual('../utils/entityModelUtils/sceneUtils'),
  checkIfEntityExists: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../common/GlobalSettings', () => ({
  getGlobalSettings: jest.fn(() => ({})),
}));

describe('SceneLayers', () => {
  const renderSceneNodesMock = jest.fn();
  const isViewingMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const addMessagesMock = jest.fn();
  const baseState = {
    getSceneProperty: getScenePropertyMock,
    renderSceneNodes: renderSceneNodesMock,
    isViewing: isViewingMock,
    addMessages: addMessagesMock,
  };
  const mockSceneMetadataModule = {};

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

  it('should detect no Scene Root Entity', async () => {
    accessStore('default').setState(baseState);
    const globalSettings = getGlobalSettings as jest.Mock;
    globalSettings.mockImplementation(() => ({
      twinMakerSceneMetadataModule: {},
    }));
    let queryFunction;
    (useQuery as jest.Mock).mockImplementation(({ queryFn, ..._ }) => {
      queryFunction = queryFn;
      return { data: [] };
    });
    (checkIfEntityExists as jest.Mock).mockImplementation(() => { return false});
    render(<SceneLayers />);
    await queryFunction();

    expect(processQueries as jest.Mock).toBeCalledTimes(1);
    expect(renderSceneNodesMock).toBeCalledTimes(0);
    expect(addMessagesMock).toBeCalledTimes(1);
  });
});
