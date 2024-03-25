import * as React from 'react';
import { create, act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';
import flushPromises from 'flush-promises';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import * as SceneLayoutComponents from '../layouts/SceneLayout';
import { invalidTestScenes, testScenes } from '../../tests/testData';

import { SceneComposerInternal } from './SceneComposerInternal';

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
    getSceneObject: () => Promise.resolve(str2ab(sceneContent)),
  };
}

describe('SceneComposerInternal', () => {
  const getSceneInfo = jest.fn();
  const mockSceneMetadataModule = {
    getSceneInfo,
  } as unknown as TwinMakerSceneMetadataModule;

  beforeEach(() => {
    jest.clearAllMocks();
    getSceneInfo.mockResolvedValue({
      capabilities: [],
      sceneMetadata: {},
    });
  });

  it('should render correctly with an empty scene in editing mode', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock('')}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an empty scene in viewing mode', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Viewing' }}
          sceneLoader={createSceneLoaderMock('')}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with a valid scene in editing mode', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(testScenes.scene1)}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render warning when minor version is newer', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.unsupportedMinorVersionScene)}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render error when major version is newer', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.unsupportedMajorVersion)}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render error when specVersion is invalid', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidSpecVersionScene)}
          sceneMetadataModule={mockSceneMetadataModule}
        />,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should support rendering multiple valid scenes', async () => {
    let container;
    await act(async () => {
      container = create(
        <div>
          <SceneComposerInternal
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.scene1)}
            sceneMetadataModule={mockSceneMetadataModule}
          />
          <SceneComposerInternal
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.scene2)}
            sceneMetadataModule={mockSceneMetadataModule}
          />
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
      container = create(
        <div>
          <SceneComposerInternal
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidJson)}
            sceneMetadataModule={mockSceneMetadataModule}
          />
          <SceneComposerInternal
            config={{ mode: 'Editing' }}
            sceneLoader={createSceneLoaderMock(testScenes.scene1)}
            sceneMetadataModule={mockSceneMetadataModule}
          />
        </div>,
      );

      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render a default error view when loading a bad scene content', async () => {
    let container;
    await act(async () => {
      container = create(
        <SceneComposerInternal
          config={{ mode: 'Editing' }}
          sceneLoader={createSceneLoaderMock(invalidTestScenes.invalidJson)}
          sceneMetadataModule={mockSceneMetadataModule}
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

    const container = create(
      <SceneComposerInternal
        config={{ mode: 'Editing' }}
        sceneLoader={createSceneLoaderMock('')}
        sceneMetadataModule={mockSceneMetadataModule}
      />,
    );

    await flushPromises();

    expect(container).toMatchSnapshot();

    mocked.mockRestore();
  });
});
