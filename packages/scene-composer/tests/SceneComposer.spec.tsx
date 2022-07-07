/* eslint-disable import/first */
/* eslint-disable import/order */
import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';

import { COMPOSER_FEATURES, SceneComposer, SceneComposerApi, setFeatureConfig, useSceneComposerApi } from '../src';
import * as FloatingToolbar from '../src/components/toolbars/floatingToolbar/FloatingToolbar';
import * as SceneLayoutComponents from '../src/layouts/scene-layout';
import { GetSceneObjectFunction } from '../src/interfaces';

import ResizeObserver from './__mocks__/ResizeObserver';
import { invalidTestScenes, testScenes } from './testData';

jest.mock('../src/components/StaticLayout', () => ({
  StaticLayout: 'StaticLayout',
}));

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));
jest.mock('resize-observer-polyfill', () => {
  return ResizeObserver;
});

function createGetSceneObjectFunction(sceneContent: string): GetSceneObjectFunction {
  return (uri: string) => Promise.resolve(str2ab(sceneContent));
}

describe('SceneComposer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setFeatureConfig({});
  });

  it('should render correctly with an empty scene in editing mode', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction('')}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an empty scene in viewing mode', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Viewing' }}
        getSceneObjectFunction={createGetSceneObjectFunction('')}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with a valid scene in editing mode', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction(testScenes.scene1)}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    // shows the scene hierarchy browser
    expect(container).toMatchSnapshot();
  });

  it('should render warning when minor version is newer', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction(invalidTestScenes.unsupportedMinorVersionScene)}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();
  });

  it('should render error when major version is newer', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction(invalidTestScenes.unsupportedMajorVersion)}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();
  });

  it('should render error when specVersion is invalid', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction(invalidTestScenes.invalidSpecVersionScene)}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();
  });

  it('should support rendering multiple valid scenes', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.MOTION_INDICATOR]: true });

    const container = renderer.create(
      <div>
        <SceneComposer
          config={{ mode: 'Editing' }}
          getSceneObjectFunction={createGetSceneObjectFunction(testScenes.scene1)}
          sceneContentUrl='file://test.json'
        />
        <SceneComposer
          config={{ mode: 'Editing' }}
          getSceneObjectFunction={createGetSceneObjectFunction(testScenes.scene2)}
          sceneContentUrl='file://test.json'
        />
      </div>,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    // verify that 2 different scenes are rendered
    expect(container).toMatchSnapshot();
  });

  it('should render both valid and invalid scene correctly', async () => {
    const container = renderer.create(
      <div>
        <SceneComposer
          config={{ mode: 'Editing' }}
          getSceneObjectFunction={createGetSceneObjectFunction(invalidTestScenes.invalidJson)}
          sceneContentUrl='file://test.json'
        />
        <SceneComposer
          config={{ mode: 'Editing' }}
          getSceneObjectFunction={createGetSceneObjectFunction(testScenes.scene1)}
          sceneContentUrl='file://test.json'
        />
      </div>,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();
  });

  it('should render a default error view when loading a bad scene content', async () => {
    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction(invalidTestScenes.invalidJson)}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();
  });

  it('should render a default error view when unknown error happens', async () => {
    const mocked = jest.spyOn(SceneLayoutComponents, 'SceneLayout').mockImplementation(() => {
      throw new Error('failed to render');
    });

    const container = renderer.create(
      <SceneComposer
        config={{ mode: 'Editing' }}
        getSceneObjectFunction={createGetSceneObjectFunction('')}
        sceneContentUrl='file://test.json'
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(container).toMatchSnapshot();

    mocked.mockRestore();
  });

  describe('useSceneComposerApi', () => {
    it('should return an api object', () => {
      let sut: SceneComposerApi | null = null;

      const TestComponent = () => {
        const sceneComposerId = 'test';
        sut = useSceneComposerApi('test');

        return (
          <SceneComposer
            sceneComposerId={sceneComposerId}
            config={{ mode: 'Editing' }}
            getSceneObjectFunction={createGetSceneObjectFunction(testScenes.scene1)}
            sceneContentUrl='file://test.json'
          />
        );
      };

      act(() => {
        renderer.create(<TestComponent />);
      });

      expect(sut).toHaveProperty('setCameraTarget');
    });
  });
});
