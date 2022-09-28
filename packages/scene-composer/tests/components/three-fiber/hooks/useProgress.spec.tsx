import { DefaultLoadingManager } from 'three';

import { useProgressImpl } from '../../../../src/components/three-fiber/hooks/useProgress';

jest.mock('three', () => ({
  DefaultLoadingManager: {},
}));

describe('useProgress', () => {
  it('should update state when DefaultLoadingManager Starts', () => {
    const item = 'test-url';
    const loaded = 0;
    const total = 100;

    // Act
    const setMock = jest.fn();
    useProgressImpl(setMock);

    if (DefaultLoadingManager.onStart) {
      DefaultLoadingManager.onStart(item, loaded, total);
    }

    expect(setMock).toBeCalledWith({
      active: true,
      item,
      loaded,
      total,
      progress: 0,
    });
  });

  it('should update state when DefaultLoadingManager Loads', () => {
    // Act
    const setMock = jest.fn();
    useProgressImpl(setMock);
    DefaultLoadingManager.onLoad();

    // Assert
    expect(setMock).toBeCalledWith({
      active: false,
    });
  });

  it('should update state when DefaultLoadingManager onError', () => {
    // Arrange
    const item = 'new Error';
    const previousState = { errors: ['Previous Errors'] };
    let result = null;

    const setMock = jest.fn((cb) => {
      result = cb(previousState);
    });

    // Act
    useProgressImpl(setMock);
    DefaultLoadingManager.onError(item);

    // Assert
    expect(result).toMatchSnapshot();
  });

  it('should update state when DefaultLoadingManager onProgress less than 100%', () => {
    // Arrange
    const item = 'test-url';
    const loaded = 25;
    const total = 100;
    const setMock = jest.fn();
    useProgressImpl(setMock);

    // Act
    DefaultLoadingManager.onProgress(item, loaded, total);

    // Assert
    expect(setMock).toBeCalledWith({
      active: true,
      item,
      loaded,
      total,
      progress: 25,
    });
  });

  it('should update state when DefaultLoadingManager onProgress equal to 100%', () => {
    // Arrange
    const item = 'test-url';
    const loaded = 100;
    const total = 100;
    const setMock = jest.fn();
    useProgressImpl(setMock);

    // Act
    DefaultLoadingManager.onProgress(item, loaded, total);

    // Assert
    expect(setMock).toBeCalledWith({
      active: true,
      item,
      loaded,
      total,
      progress: 100,
    });
  });

  it('should update progress onDownloadProgress', () => {
    // Arrange
    const item = 'test-url';
    const loaded = 100;
    const total = 100;
    const setMock = jest.fn();
    useProgressImpl(setMock);

    // Act
    // @ts-ignore
    DefaultLoadingManager.__onDownloadProgress(item, loaded, total);

    // Assert
    expect(setMock).toBeCalledWith({
      active: true,
      downloadItem: item,
      downloaded: loaded,
      downloadTotal: total,
      downloadProgress: 100,
    });
  });
});
