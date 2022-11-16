import React, { ChangeEvent, useMemo } from 'react';
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { applyMode, Mode, applyDensity, Density } from '@awsui/global-styles';
import { ComponentStory, ComponentMeta, forceReRender } from '@storybook/react';
import { initialize, SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useRef } from '@storybook/addons';
import str2ab from 'string-to-arraybuffer';

import { SceneComposerInternal, useSceneComposerApi } from '../src/components/SceneComposerInternal';
import { GetSceneObjectFunction, ISceneDocumentSnapshot, SceneComposerInternalProps } from '../src/interfaces';
import { setDebugMode } from '../src/common/GlobalSettings';
import {
  getTestDataInputContinuous,
  testScenes,
  invalidTestScenes,
  convertDataInputToDataStreams,
} from '../tests/testData';
import { COMPOSER_FEATURES } from '../src/interfaces/feature';

import { useMockedValueDataBindingProvider } from './useMockedValueDataBindingProvider';

import '@awsui/global-styles/index.css';
import '@awsui/global-styles/dark-mode-utils.css';
const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';

// 'Cookie_Factory_Warehouse_Building_No_Site.glb'
let localModelToLoad = 'CookieFactoryEnvironment.glb';

const sampleSceneContentUrl1 = './sampleScene1';
const sampleSceneContentUrl2 = './sampleScene2';
function createGetSceneObjectFunction(sceneContent: string): GetSceneObjectFunction {
  return (uri: string) => {
    if (uri !== sampleSceneContentUrl1 && uri !== sampleSceneContentUrl2) {
      return null;
    } else {
      return Promise.resolve(str2ab(sceneContent));
    }
  };
}

const commonLoaders = [
  async () => ({
    configurations: await (async () => {
      const awsAccessKeyId = text('awsAccessKeyId', process.env.STORYBOOK_ACCESS_KEY_ID || '');
      const awsSecretAccessKey = text('awsSecretAccessKey', process.env.STORYBOOK_SECRET_ACCESS_KEY || '');
      const awsSessionToken = text('awsSessionToken', process.env.STORYBOOK_SESSION_TOKEN || '');
      const workspaceId = text('workspaceId', '');
      const sceneId = text('sceneId', '');
      const theme = select('theme', { dark: 'dark', light: 'light' }, 'dark');
      const density = select('density', { compact: 'compact', comfortable: 'comfortable' }, 'comfortable');
      const mode = select('mode', { Viewing: 'Viewing', Editing: 'Editing' }, 'Editing');
      const loadFromAws = boolean('Load from AWS', false);
      localModelToLoad = text('local glb model', 'PALLET_JACK.glb');

      let sceneLoader: SceneLoader;

      const loadFromAwsFn = async () => {
        const credentials = {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
          sessionToken: awsSessionToken,
        };

        const init = initialize(workspaceId, {
          awsCredentials: credentials,
          awsRegion: region,
          tmEndpoint: rociEndpoint,
        });
        const sceneLoader = init.s3SceneLoader(sceneId);

        return [sceneLoader];
      };

      const loadFromLocalFn = () => {
        const _getSceneObjectFunction: GetSceneObjectFunction = createGetSceneObjectFunction(testScenes.scene1);
        const _sceneLoader = {
          getSceneUri: () => Promise.resolve(sampleSceneContentUrl1),
          getSceneObject: _getSceneObjectFunction,
        };
        return [_sceneLoader];
      };

      if (awsAccessKeyId !== '') {
        try {
          [sceneLoader] = await loadFromAwsFn();
        } catch (error) {
          console.error('Error: failed to load from aws, loading a default local scene instead', error);

          [sceneLoader] = loadFromLocalFn();
        }
      } else {
        [sceneLoader] = loadFromLocalFn();
      }

      setDebugMode();
      const valueDataBindingProvider = useMockedValueDataBindingProvider();

      return {
        loadFromAws,
        density,
        theme,
        mode,
        valueDataBindingProvider,
        sceneLoader,
        sceneId,
      };
    })(),
  }),
];

const knobsConfigurationDecorator = [
  withKnobs({ escapeHTML: false }),
  (story, { parameters, loaded: { configurations }, args }) => {
    const stagedSceneDocumentSnapshotRef = useRef<ISceneDocumentSnapshot | undefined>(undefined);
    const fileRef = useRef<HTMLInputElement | null>(null);
    // const [sceneFileLocal, setSceneFileLocal] = useState<string | undefined>(undefined);

    const { theme, density, mode, valueDataBindingProvider, sceneLoader, sceneId } = configurations;

    const cameraTarget = text('camera target ref', '');
    const anchorRef = text('anchor ref', '');

    console.log('args:', args);

    if (theme === 'light') {
      applyMode(Mode.Light);
    } else {
      applyMode(Mode.Dark);
    }

    if (density === 'comfortable') {
      applyDensity(Density.Comfortable);
    } else {
      applyDensity(Density.Compact);
    }

    args.config = args.config || {};
    args.config.mode = mode;
    args.config.dracoDecoder = {
      enable: true,
    };
    args.config = {
      featureConfig: {
        [COMPOSER_FEATURES.SceneHierarchyRedesign]: true, // New Scene Hierarchy Panel
        [COMPOSER_FEATURES.SceneHierarchySearch]: true, // Entity Search
        [COMPOSER_FEATURES.SceneHierarchyMultiSelect]: false, // MultiSelect disabled, not sure if we will support this.
        [COMPOSER_FEATURES.SceneHierarchyReorder]: true, // Drag/Drop Reordering
        [COMPOSER_FEATURES.SubModelSelection]: true,
        [COMPOSER_FEATURES.ENHANCED_EDITING]: true,
        [COMPOSER_FEATURES.CameraView]: true,
        [COMPOSER_FEATURES.EnvironmentModel]: false,
        [COMPOSER_FEATURES.TagResize]: false,
        [COMPOSER_FEATURES.SubModelMovement]: false,
        ...args.config.featureConfig,
      },
      ...args.config,
    };
    args.valueDataBindingProvider = valueDataBindingProvider;
    args.sceneLoader = sceneLoader;
    args.sceneId = sceneId;

    const configuredOnSceneUpdatedCallback = args.onSceneUpdated;
    args.onSceneUpdated = useCallback((e) => {
      stagedSceneDocumentSnapshotRef.current = e;
      configuredOnSceneUpdatedCallback(e);
    }, []);

    const sceneComposerApi = useSceneComposerApi('scene1');

    const onFileUploadChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        // const file = e.target.files?.[0];
        // file?.text().then((sceneText) => {
        //   setSceneFileLocal(sceneText);
        // });
      },
      [fileRef],
    );

    useToolbarActions('save', <div>Save</div>, {
      onClick: () => {
        if (stagedSceneDocumentSnapshotRef.current) {
          const data = stagedSceneDocumentSnapshotRef.current.serialize('1.0');
          const file = new Blob([data], { type: 'application/json' });
          const a = document.createElement('a');
          const url = URL.createObjectURL(file);
          a.href = url;
          a.download = 'scene.json';
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      },
    });

    useToolbarActions('load', <div>Load</div>, {
      onClick: () => {
        if (fileRef.current) {
          fileRef.current.click();
        }
      },
    });

    useToolbarActions('refresh', <div>Refresh</div>, {
      onClick: () => {
        forceReRender();
      },
    });

    useToolbarActions('camera', <div>Move Camera</div>, {
      onClick: () => {
        sceneComposerApi.setCameraTarget(cameraTarget, 'transition');
      },
    });

    useToolbarActions('find label', <div>Find {'&'} Move Camera</div>, {
      onClick: () => {
        const dataFrameLabel = sceneComposerApi.findSceneNodeRefBy('/room1/temperatureSensor1:temperature');
        sceneComposerApi.setCameraTarget(dataFrameLabel[0], 'transition');
      },
    });

    useToolbarActions('anchor', <div>Select Anchor</div>, {
      onClick: () => {
        sceneComposerApi.setSelectedSceneNodeRef(anchorRef);
      },
    });

    return (
      <div>
        <input hidden id='fileUpload' ref={fileRef} type='file' onChange={onFileUploadChange} accept='*' />
        <div className={'awsui'} style={{ height: '100vh' }}>
          {story()}
        </div>
      </div>
    );
  },
];

export default {
  title: 'Components/SceneComposer',
  component: SceneComposerInternal,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SceneComposerInternal>;

export const Default: ComponentStory<typeof SceneComposerInternal> = (
  args: SceneComposerInternalProps & { sceneId?: string },
) => {
  const loader = useMemo(() => {
    return args.sceneLoader;
  }, [args.sceneId]);

  return <SceneComposerInternal sceneComposerId='scene1' {...args} sceneLoader={loader} />;
};
Default.parameters = {};
Default.decorators = knobsConfigurationDecorator;
Default.args = {
  onSceneUpdated: (e) => {
    // empty to avoid state being printed out
    // console.log('document changed', e.serialize('1.0'));
  },
  dataStreams: convertDataInputToDataStreams(getTestDataInputContinuous()),
  viewport: {
    start: new Date(getTestDataInputContinuous().timeRange.from),
    end: new Date(getTestDataInputContinuous().timeRange.to),
  },
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
  showAssetBrowserCallback: (resultCallback) => {
    resultCallback(null, localModelToLoad);
  },
  onWidgetClick: (e) => {
    console.log('Widget Click occurred', e);
  },
  onSelectionChanged: (e) => {
    console.log('Selection Change occurred', e);
  },
  activeCamera: '',
};
// @ts-ignore
Default.loaders = commonLoaders;

export const InvalidScenes: ComponentStory<typeof SceneComposerInternal> = (args) => {
  const sceneContent = select('scene', invalidTestScenes, invalidTestScenes.privateBeta);
  const getSceneObjectFunction: GetSceneObjectFunction = createGetSceneObjectFunction(sceneContent);
  return (
    <div className={'awsui'} style={{ height: '100vh' }}>
      <SceneComposerInternal
        {...args}
        sceneLoader={{
          getSceneUri: () => Promise.resolve(sampleSceneContentUrl1),
          getSceneObject: getSceneObjectFunction,
        }}
      />
    </div>
  );
};
InvalidScenes.parameters = {};
InvalidScenes.decorators = knobsConfigurationDecorator;
InvalidScenes.args = {};
// @ts-ignore
InvalidScenes.loaders = commonLoaders;

export const MultiInstance: ComponentStory<typeof SceneComposerInternal> = (args) => {
  args.config = {
    mode: 'Viewing',
  };

  const getSceneObjectFunction1: GetSceneObjectFunction = createGetSceneObjectFunction(testScenes.scene1);
  const getSceneObjectFunction2: GetSceneObjectFunction = createGetSceneObjectFunction(testScenes.scene2);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, border: '1px solid red' }}>
        <SceneComposerInternal
          {...args}
          sceneLoader={{
            getSceneUri: () => Promise.resolve(sampleSceneContentUrl1),
            getSceneObject: getSceneObjectFunction1,
          }}
        />
      </div>
      <div style={{ flex: 1, border: '1px solid blue' }}>
        <SceneComposerInternal
          {...args}
          sceneLoader={{
            getSceneUri: () => Promise.resolve(sampleSceneContentUrl2),
            getSceneObject: getSceneObjectFunction2,
          }}
        />
      </div>
    </div>
  );
};
MultiInstance.parameters = {};
MultiInstance.decorators = knobsConfigurationDecorator;
MultiInstance.args = {
  onSceneUpdated: (e) => {
    // empty to avoid state being printed out
    // console.log('document changed', e.serialize('1.0'));
  },
  dataStreams: convertDataInputToDataStreams(getTestDataInputContinuous()),
  viewport: {
    start: new Date(getTestDataInputContinuous().timeRange.from),
    end: new Date(getTestDataInputContinuous().timeRange.to),
  },
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
  showAssetBrowserCallback: (resultCallback) => {
    resultCallback(null, localModelToLoad);
  },
  onSelectionChanged: (e) => {
    console.log('anchor clicked', e);
  },
};
// @ts-ignore
MultiInstance.loaders = commonLoaders;

export const SubmodelSelection: ComponentStory<typeof SceneComposerInternal> = (
  args: SceneComposerInternalProps & { sceneId?: string },
) => {
  const loader = useMemo(() => {
    return args.sceneLoader;
  }, [args.sceneId]);

  return <SceneComposerInternal sceneComposerId='scene3' {...args} sceneLoader={loader} />;
};

SubmodelSelection.parameters = {};
SubmodelSelection.decorators = knobsConfigurationDecorator;
SubmodelSelection.args = {
  onSceneUpdated: (e) => {
    // empty to avoid state being printed out
    // console.log('document changed', e.serialize('1'));
  },
  dataStreams: convertDataInputToDataStreams(getTestDataInputContinuous()),
  viewport: {
    start: new Date(getTestDataInputContinuous().timeRange.from),
    end: new Date(getTestDataInputContinuous().timeRange.to),
  },
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
  showAssetBrowserCallback: (resultCallback) => {
    resultCallback(null, localModelToLoad);
  },
  onSelectionChanged: (e) => {
    console.log('anchor clicked', e);
  },
  config: {
    mode: 'Editing',
    featureConfig: {
      [COMPOSER_FEATURES.SceneHierarchyRedesign]: true, // New Scene Hierarchy Panel
      [COMPOSER_FEATURES.SceneHierarchySearch]: true, // Entity Search
      [COMPOSER_FEATURES.SceneHierarchyMultiSelect]: false, // MultiSelect disabled, not sure if we will support this.
      [COMPOSER_FEATURES.SceneHierarchyReorder]: true, // Drag/Drop Reordering
      [COMPOSER_FEATURES.SubModelSelection]: true,
      [COMPOSER_FEATURES.ENHANCED_EDITING]: true,
    },
  },
};
// @ts-ignore
SubmodelSelection.loaders = commonLoaders;

export const Viewer: ComponentStory<typeof SceneComposerInternal> = (
  args: SceneComposerInternalProps & { sceneId?: string },
) => {
  const loader = useMemo(() => {
    return args.sceneLoader;
  }, [args.sceneId]);

  return <SceneComposerInternal sceneComposerId='scene3' {...args} sceneLoader={loader} />;
};

Viewer.parameters = {};
Viewer.decorators = knobsConfigurationDecorator;
Viewer.args = {
  onSceneUpdated: (e) => {
    // empty to avoid state being printed out
    // console.log('document changed', e.serialize('1'));
  },
  dataStreams: convertDataInputToDataStreams(getTestDataInputContinuous()),
  viewport: {
    start: new Date(getTestDataInputContinuous().timeRange.from),
    end: new Date(getTestDataInputContinuous().timeRange.to),
  },
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
  showAssetBrowserCallback: (resultCallback) => {
    resultCallback(null, localModelToLoad);
  },
  onSelectionChanged: (e) => {
    console.log('anchor clicked', e);
  },
  config: {
    mode: 'Viewing',
    featureConfig: {
      [COMPOSER_FEATURES.SceneHierarchyRedesign]: true, // New Scene Hierarchy Panel
      [COMPOSER_FEATURES.SceneHierarchySearch]: true, // Entity Search
      [COMPOSER_FEATURES.SceneHierarchyMultiSelect]: false, // MultiSelect disabled, not sure if we will support this.
      [COMPOSER_FEATURES.SceneHierarchyReorder]: true, // Drag/Drop Reordering
      [COMPOSER_FEATURES.SubModelSelection]: true,
      [COMPOSER_FEATURES.ENHANCED_EDITING]: true,
    },
  },
};
// @ts-ignore
Viewer.loaders = commonLoaders;

export const WaterTank: ComponentStory<typeof SceneComposerInternal> = (
  args: SceneComposerInternalProps & { sceneId?: string },
) => {
  const loader = useMemo(() => {
    return {
      getSceneUri: () => Promise.resolve(sampleSceneContentUrl1),
      getSceneObject: createGetSceneObjectFunction(testScenes.waterTank),
    };
  }, [args.sceneId]);

  return <SceneComposerInternal sceneComposerId='WaterTank' {...args} sceneLoader={loader} />;
};

WaterTank.parameters = {};
WaterTank.decorators = knobsConfigurationDecorator;
WaterTank.args = {
  onSceneUpdated: (e) => {
    // empty to avoid state being printed out
    // console.log('document changed', e.serialize('1'));
  },
  dataStreams: convertDataInputToDataStreams(getTestDataInputContinuous()),
  viewport: {
    start: new Date(getTestDataInputContinuous().timeRange.from),
    end: new Date(getTestDataInputContinuous().timeRange.to),
  },
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
  showAssetBrowserCallback: (resultCallback) => {
    resultCallback(null, localModelToLoad);
  },

  onSelectionChanged: (e) => {
    console.log('anchor clicked', e);
  },
  config: {
    mode: 'Viewing',
    featureConfig: {
      [COMPOSER_FEATURES.SceneHierarchyRedesign]: true, // New Scene Hierarchy Panel
      [COMPOSER_FEATURES.SceneHierarchySearch]: true, // Entity Search
      [COMPOSER_FEATURES.SceneHierarchyMultiSelect]: false, // MultiSelect disabled, not sure if we will support this.
      [COMPOSER_FEATURES.SceneHierarchyReorder]: true, // Drag/Drop Reordering
      [COMPOSER_FEATURES.SubModelSelection]: true,
      [COMPOSER_FEATURES.ENHANCED_EDITING]: true,
      [COMPOSER_FEATURES.OpacityRule]: true,
    },
  },
};
// @ts-ignore
WaterTank.loaders = commonLoaders;
