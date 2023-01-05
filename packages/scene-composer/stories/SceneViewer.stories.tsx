import React, { useMemo, useRef } from 'react';
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { ComponentStory, ComponentMeta, forceReRender } from '@storybook/react';
import { initialize, SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useState } from '@storybook/addons';
import str2ab from 'string-to-arraybuffer';
import { Viewport } from '@iot-app-kit/core';

import { useSceneComposerApi } from '../src/components/SceneComposerInternal';
import { GetSceneObjectFunction, ISelectionChangedEvent, SceneViewerProps } from '../src/interfaces';
import { setDebugMode } from '../src/common/GlobalSettings';
import { convertDataInputToDataStreams, getTestDataInputContinuous, testScenes } from '../tests/testData';
import { SceneViewer } from '../src';

import '@awsui/global-styles/index.css';
import '@awsui/global-styles/dark-mode-utils.css';
import { TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';

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

let query
export const entityQueries: TwinMakerQuery[] = [
  {
    entityId: 'dbc6dd49-7189-423c-ae3a-a6539b971075',
    componentName: 'esp32-compo',
    properties: [
      { propertyName: 'onoff' },
     { propertyName: 'rpm' }
    ],
  },
];


const commonLoaders = [
  async () => ({
    configurations: await (async () => {
      const awsAccessKeyId = text('awsAccessKeyId', process.env.STORYBOOK_ACCESS_KEY_ID || '');
      const awsSecretAccessKey = text('awsSecretAccessKey', process.env.STORYBOOK_SECRET_ACCESS_KEY || '');
      const awsSessionToken = text('awsSessionToken', process.env.STORYBOOK_SESSION_TOKEN || '');
      const workspaceId = text('workspaceId', 'Twin-ASM');
      const sceneId = text('sceneId', 'test');
      const loadFromAws = boolean('Load from AWS', true);
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
        query = init.query.timeSeriesData;

        return [sceneLoader];
      };

      const loadFromLocalFn = () => {
        const _getSceneObjectFunction: GetSceneObjectFunction = createGetSceneObjectFunction(testScenes.scene2);
        const _sceneLoader = {
          getSceneUri: () => Promise.resolve(sampleSceneContentUrl2),
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
        sceneId,
      };
    })(),
  }),
];

const knobsConfigurationDecorator = [
  withKnobs({ escapeHTML: false }),
  (story, { parameters, loaded: { configurations }, args }) => {
    const { sceneLoader, sceneId } = configurations;

    const cameraTarget = text('camera target ref', '');
    const anchorRef = text('anchor ref', '');

    args.config = args.config || {};
    args.config.dracoDecoder = {
      enable: true,
    };
    args.sceneLoader = sceneLoader;
    args.sceneId = sceneId;

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
  title: 'Components/Scene Viewer',
  component: SceneViewer,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SceneViewer>;

export const Default: ComponentStory<typeof SceneViewer> = (args: SceneViewerProps & { sceneId?: string }) => {
  const [selected, setSelected] = useState<any>({ entityId: 'room1', componentName: 'temperatureSensor2' });
  const loader = useMemo(() => {
    return args.sceneLoader;
  }, [args.sceneId]);
  const q = useMemo(() => {
    return query ? [...entityQueries.map((q) => query(q))] : undefined
  }, [args])

  const viewport = useRef<Viewport>({
    start: new Date('2023 1 3'),
    end: new Date(),
  });

  const onSelectionChanged = useCallback((e: ISelectionChangedEvent) => {
    const dataBindingContext = e.additionalComponentData?.[0].dataBindingContext;
    console.log('onSelectionChanged', dataBindingContext);

    setSelected(
      dataBindingContext
        ? {
            entityId: (dataBindingContext as any)?.entityId,
            componentName: (dataBindingContext as any)?.componentName,
          }
        : undefined,
    );
  }, []);

  return (
    <SceneViewer
      sceneComposerId='scene1'
      {...args}
      sceneLoader={loader}
      onSelectionChanged={onSelectionChanged}
      selectedDataBinding={selected}
      dataStreams={undefined}
      queries={q}
      viewport={viewport.current}
    />
  );
};
Default.parameters = {};
Default.decorators = knobsConfigurationDecorator;
Default.args = {
  dataBindingTemplate: {
    sel_entity: 'room1',
    sel_comp: 'temperatureSensor2',
  },
};
// @ts-ignore
Default.loaders = commonLoaders;
