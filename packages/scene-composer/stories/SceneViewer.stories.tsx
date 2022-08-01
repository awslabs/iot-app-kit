import React from 'react';
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { ComponentStory, ComponentMeta, forceReRender } from '@storybook/react';
import { initialize, SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useState } from '@storybook/addons';
import str2ab from 'string-to-arraybuffer';

import { useSceneComposerApi } from '../src/components/SceneComposerInternal';
import { GetSceneObjectFunction } from '../src/interfaces';
import { setDebugMode } from '../src/common/GlobalSettings';
import { getTestDataInputContinuous, testScenes } from '../tests/testData';
import { SceneViewer } from '../src';

import '@awsui/global-styles/index.css';
import '@awsui/global-styles/dark-mode-utils.css';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';

// 'Cookie_Factory_Warehouse_Building_No_Site.glb'
let localModelToLoad = 'PALLET_JACK.glb';

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
          getSceneUrl: () => Promise.resolve(sampleSceneContentUrl1),
          getSceneObject: _getSceneObjectFunction,
        };
        return [_sceneLoader];
      };

      if (loadFromAws) {
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

      return {
        loadFromAws,
        sceneLoader,
      };
    })(),
  }),
];

const knobsConfigurationDecorator = [
  withKnobs({ escapeHTML: false }),
  (story, { parameters, loaded: { configurations }, args }) => {
    const { loadFromAws, sceneLoader } = configurations;

    const cameraTarget = text('camera target ref', '');
    const anchorRef = text('anchor ref', '');

    args.config = args.config || {};
    args.config.dracoDecoder = {
      enable: true,
    };
    args.config.cdnPath = loadFromAws ? window.location.origin : undefined;
    args.sceneLoader = sceneLoader;

    const sceneComposerApi = useSceneComposerApi('scene1');

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

    return story();
  },
];

export default {
  title: 'Components/SceneViewer',
  component: SceneViewer,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SceneViewer>;

export const Default: ComponentStory<typeof SceneViewer> = (args) => {
  const [selected, setSelected] = useState<any>(undefined);
  const onTargetObjectChanged = useCallback((e) => {
    if (e.data?.eventType === 'change') {
      setSelected(
        e.data.isSelected
          ? {
              entityId: (e.data.dataBindingContext as any).entityId,
              componentName: (e.data.dataBindingContext as any).componentName,
            }
          : undefined,
      );
    }
  }, []);

  return (
    <SceneViewer
      sceneComposerId='scene1'
      {...args}
      onTargetObjectChanged={onTargetObjectChanged}
      selectedDataBinding={selected}
    />
  );
};
Default.parameters = {};
Default.decorators = knobsConfigurationDecorator;
Default.args = {
  dataInput: getTestDataInputContinuous(),
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
};
// @ts-ignore
Default.loaders = commonLoaders;
