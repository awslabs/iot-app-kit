import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';
import flushPromises from 'flush-promises';

import { SceneComposerInternal, SceneComposerApi, useSceneComposerApi } from '..';
import * as SceneLayoutComponents from '../layouts/SceneLayout';
import { invalidTestScenes, testScenes } from '../../tests/testData';

jest.mock('../layouts/StaticLayout', () => ({
  StaticLayout: 'StaticLayout',
}));

jest.mock((window as any).ResizeObserver, () => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));
jest.mock('resize-observer-polyfill', () => {
  return ResizeObserver;
});

function createSceneLoaderMock(sceneContent: string) {
  return {
    getSceneUri: () => Promise.resolve('file://test.json'),
    getSceneUrl: () => Promise.resolve('file://test.json'),
    getSceneObject: (uri: string) => Promise.resolve(str2ab(sceneContent)),
  };
}

describe('SceneComposerInternal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with an empty scene in editing mode', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock('')} />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an empty scene in viewing mode', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal config={{ mode: 'Viewing' }} sceneLoader={createSceneLoaderMock('')} />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with a valid scene in editing mode', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock(testScenes.scene1)} />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render warning when minor version is newer', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.unsupportedMinorVersionScene)}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render error when major version is newer', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.unsupportedMajorVersion)}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render error when specVersion is invalid', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidSpecVersionScene)}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should support rendering multiple valid scenes', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <div>
          <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock(testScenes.scene1)} />
          <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock(testScenes.scene2)} />
        </div>,
      );

      await flushPromises();
    });

    // verify that 2 different scenes are rendered
    expect(container).toMatchSnapshot();
  });

  it('should render both valid and invalid scene correctly', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <div>
          <SceneComposerInternal
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidJson)}
          />
          <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock(testScenes.scene1)} />
        </div>,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render a default error view when loading a bad scene content', async () => {
    let container;
    await act(async () => {
      container = renderer.create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidJson)}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render a default error view when unknown error happens', async () => {
    const mocked = jest.spyOn(SceneLayoutComponents, 'SceneLayout').mockImplementation(() => {
      throw new Error('failed to render');
    });

    const container = renderer.create(
      <SceneComposerInternal config={{ mode: 'Editing' }} sceneLoader={createSceneLoaderMock('')} />,
    );

    await flushPromises();

    expect(container).toMatchSnapshot();

    mocked.mockRestore();
  });

  describe('useSceneComposerApi', () => {
    it('should return an api object', async () => {
      let sut: SceneComposerApi | null = null;

      const TestComponent = () => {
        const sceneComposerId = 'test';
        sut = useSceneComposerApi('test');

        return (
          <SceneComposerInternal
            sceneComposerId={sceneComposerId}
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.scene1)}
          />
        );
      };

      await act(async () => {
        renderer.create(<TestComponent />);

        await flushPromises();
      });

      expect(sut).toHaveProperty('setCameraTarget');
    });
  });
});
