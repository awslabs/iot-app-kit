import { type CredentialProvider, type Credentials } from '@aws-sdk/types';
import { type Viewport } from '@iot-app-kit/core';
import { TimeSelection, TimeSync } from '@iot-app-kit/react-components';
import { type FC, useCallback, useMemo, useRef } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import styled from 'styled-components';

import {
  AssetType,
  type COMPOSER_FEATURES,
  type ExternalLibraryConfig,
  type ISceneDocumentSnapshot,
  ModelFileTypeList,
  type SceneViewerPropsShared,
  TextureFileTypeList,
} from '../../src';
import { SceneComposerInternal } from '../../src/components/SceneComposerInternal';
import {
  type AssetBrowserResultCallback,
  type OnSceneUpdateCallback,
  type OperationMode,
  type ShowAssetBrowserCallback,
} from '../../src/interfaces/sceneComposerInternal';
import { convertDataInputToDataStreams, getTestDataInputContinuous } from '../../tests/testData';

import { viewerArgTypes } from './argTypes';
import useDataSource from './hooks/useDataSource';
import useLoader from './hooks/useLoader';
import useSceneMetadataModule from './hooks/useSceneMetadataModule';
import { mapFeatures } from './utils';

const SceneComposerContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  canvas {
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
  }
`;

export interface SceneComposerWrapperProps extends SceneViewerPropsShared {
  source: 'local' | 'aws';
  scene?: string;
  sceneId?: string;
  awsCredentials?: Credentials | CredentialProvider;
  workspaceId?: string;
  features?: COMPOSER_FEATURES[];
  mode: OperationMode;
  matterportModelId?: string;
  matterportApplicationKey?: string;
  onSceneUpdated?: OnSceneUpdateCallback;
  viewportDurationSecs?: number;
  queriesJSON?: string;
  showAssetBrowserCallback: ShowAssetBrowserCallback;
  assetType?: AssetType;
}

const SceneComposerWrapper: FC<SceneComposerWrapperProps> = ({
  source = 'local',
  scene: localScene,
  mode = 'Editing',
  awsCredentials,
  workspaceId,
  sceneId,
  features = [],
  sceneLoader: _ignoredLoader,
  onSceneUpdated = () => {},
  matterportModelId,
  matterportApplicationKey,
  viewportDurationSecs,
  queriesJSON,
  showAssetBrowserCallback: actionRecorderShowAssetBrowserCallback,
  assetType = AssetType.GLB,
  ...props
}: SceneComposerWrapperProps) => {
  const duration = viewportDurationSecs ? viewportDurationSecs : 300; //default 5 minutes
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene_1';
  const dataSource = useDataSource(awsCredentials, workspaceId);
  const { loader, bindingProvider } = useLoader(source, scene, dataSource, sceneId);
  const sceneMetadataModule = useSceneMetadataModule({ source, scene, sceneId }, dataSource);
  const isDarkMode = useDarkMode();

  const config = useMemo(
    () => ({
      dracoDecoder: {
        enable: true,
      },
      mode,
      colorTheme: isDarkMode ? 'dark' : 'light',
      featureConfig: mapFeatures(features),
    }),
    [mode, isDarkMode, features],
  );

  const viewport: Viewport = useMemo(() => {
    // if using a custom query instead of mock poll the view port
    if (queriesJSON) {
      return {
        duration: duration * 1000,
      };
    } else {
      return {
        start: new Date(getTestDataInputContinuous().timeRange.from),
        end: new Date(getTestDataInputContinuous().timeRange.to),
      };
    }
  }, [queriesJSON, duration]);

  const queries = queriesJSON
    ? JSON.parse(queriesJSON).map((q) => {
        const data = dataSource.query.timeSeriesData(q);
        return data;
      })
    : undefined;

  let externalLibraryConfig: ExternalLibraryConfig | undefined;

  if (matterportModelId) {
    externalLibraryConfig = {
      matterport: {
        modelId: matterportModelId,
        applicationKey: matterportApplicationKey,
      },
    };
  }

  const handleSceneUpdated: OnSceneUpdateCallback = useCallback(
    (sceneSnapshot) => {
      stagedScene.current = sceneSnapshot;
      onSceneUpdated(sceneSnapshot);
    },
    [onSceneUpdated],
  );

  const defaultAssetBrowserCallback = (cb: AssetBrowserResultCallback) => {
    cb(null, 'PALLET_JACK.glb');
  };

  const mockAssetBrowserCallback: ShowAssetBrowserCallback = useCallback(
    (cb: AssetBrowserResultCallback, typeList?: AssetType[]) => {
      actionRecorderShowAssetBrowserCallback(cb);
      if (source === 'local') {
        if (typeList) {
          if (typeList === ModelFileTypeList) {
            if (assetType === AssetType.TILES_3D) {
              cb(null, 'MIXER_Tiles3D/tileset.json');
            } else {
              defaultAssetBrowserCallback(cb);
            }
          } else if (typeList === TextureFileTypeList) {
            cb(null, 'PB_AWS_logo_RGB_stacked.png');
          } else {
            defaultAssetBrowserCallback(cb);
          }
        } else {
          defaultAssetBrowserCallback(cb);
        }
      } else {
        cb(null, 'CookieFactoryMixer.glb'); // Update the string to a model available in your S3 bucket
      }
    },
    [source, assetType, actionRecorderShowAssetBrowserCallback],
  );

  if (loader) {
    return (
      <TimeSync group='scene-composer' initialViewport={viewport}>
        <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
          <TimeSelection />
          <SceneComposerInternal
            sceneLoader={loader}
            sceneMetadataModule={sceneMetadataModule}
            config={config}
            externalLibraryConfig={externalLibraryConfig}
            queries={queries}
            valueDataBindingProviders={bindingProvider}
            onSceneUpdated={handleSceneUpdated}
            dataStreams={source === 'local' ? convertDataInputToDataStreams(getTestDataInputContinuous()) : undefined}
            showAssetBrowserCallback={mockAssetBrowserCallback}
            {...props}
          />
        </SceneComposerContainer>
      </TimeSync>
    );
  }

  return <div>Configure your AWS Credentials in the control panel, or switch to local scene to render</div>;
};

export default SceneComposerWrapper;

/*
export interface MatterportConfig {
  modelId: string;
  accessToken?: string;
  applicationKey?: string;
  assetBase?: string;
}
*/
export const argTypes = {
  ...viewerArgTypes,
  matterportModelId: {
    table: { category: 'External Library Config' },
    control: 'text',
  },
  matterportApplicationKey: {
    table: { category: 'External Library Config' },
    control: 'text',
  },
  mode: {
    label: 'Operation Mode',
    options: ['Editing', 'Viewing'],
    control: 'inline-radio',
    table: { category: 'Advanced' },
  },
  onSceneUpdated: {
    action: 'scene-updated',
    table: { category: 'Events' },
  },
  onSceneLoaded: {
    action: 'scene-loaded',
    table: { category: 'Events' },
  },
  onError: {
    action: 'error',
    table: { category: 'Events' },
  },
  showAssetBrowserCallback: {
    action: 'show-asset-browser',
    table: { category: 'Events' },
  },
} as const;
