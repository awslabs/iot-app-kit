import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { Mode, Density } from '@awsui/global-styles';
import styled from 'styled-components';
import { CredentialProvider, Credentials } from '@aws-sdk/types';
import { Viewport } from '@iot-app-kit/core';
import { TimeSync, TimeSelection } from '@iot-app-kit/react-components';

import {
  COMPOSER_FEATURES,
  ExternalLibraryConfig,
  ISceneDocumentSnapshot,
  OnSceneUpdateCallback,
  OperationMode,
  SceneComposerInternal,
  SceneViewerPropsShared,
  setTMClient,
} from '../../src';
import { convertDataInputToDataStreams, getTestDataInputContinuous } from '../../tests/testData';

import ThemeManager, { ThemeManagerProps } from './theme-manager';
import useLoader from './hooks/useLoader';
import useSceneMetadataModule from './hooks/useSceneMetadataModule';
import { mapFeatures } from './utils';
import { viewerArgTypes } from './argTypes';
import useDataSource, { tmClient } from './hooks/useDataSource';

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

interface SceneComposerWrapperProps extends SceneViewerPropsShared, ThemeManagerProps {
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
  showAssetBrowserCallback;
  viewportDurationSecs?: number;
  queriesJSON?: string;
  addModelUri?: string;
  query?: string;
}

const SceneComposerWrapper: FC<SceneComposerWrapperProps> = ({
  source = 'local',
  scene: localScene,
  theme = Mode.Dark,
  density = Density.Comfortable,
  mode = 'Editing',
  awsCredentials,
  workspaceId,
  sceneId,
  features = [],
  sceneLoader: ignoredLoader,
  onSceneUpdated = () => {},
  showAssetBrowserCallback,
  matterportModelId,
  matterportApplicationKey,
  viewportDurationSecs,
  queriesJSON,
  addModelUri = 'CookieFactoryMixer.glb',
  // query = "SELECT entity FROM EntityGraph MATCH (entity),entity.components AS c WHERE c.componentTypeId LIKE 'com.example.3d.%'",
  // query = "SELECT entity FROM EntityGraph MATCH (entity),entity.components AS c WHERE c.componentTypeId LIKE 'com.example.3d.%' AND entity.entityName LIKE 'Mix%'"
  // query = "SELECT entity FROM EntityGraph MATCH (entity),entity.components AS c WHERE c.componentTypeId LIKE 'com.example.3d.%' AND entity.entityName LIKE 'Mix%' OR entity.entityName LIKE 'Env%'"
query = "SELECT entity, r, e, entity.entityName, e.entityName FROM EntityGraph MATCH (entity)-[r]-(e), entity.components AS c WHERE c.componentTypeId LIKE 'com.example.3d.%'",// AND entity.entityId LIKE 'Mixer_0%'",
  ...props
}: SceneComposerWrapperProps) => {
  const duration = viewportDurationSecs ? viewportDurationSecs : 300; //default 5 minutes
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene_1';
  const dataSource = useDataSource(awsCredentials, workspaceId);
  const { loader, bindingProvider } = useLoader(source, scene, dataSource, sceneId);
  const sceneMetadataModule = useSceneMetadataModule({ source, scene, sceneId }, dataSource);

  const config = useMemo(
    () => ({
      dracoDecoder: {
        enable: true,
      },
      mode,
      colorTheme: theme,
      featureConfig: mapFeatures(features),
    }),
    [mode, theme, features],
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

  const handleSceneUpdated: OnSceneUpdateCallback = useCallback((sceneSnapshot) => {
    stagedScene.current = sceneSnapshot;
    onSceneUpdated(sceneSnapshot);
  }, []);

  useEffect(() => {
    setTMClient(tmClient, sceneId || '', workspaceId || '')
  }, [tmClient, sceneId, workspaceId])

  if (loader) {
    return (
      <TimeSync group='scene-composer' initialViewport={viewport}>
        <ThemeManager theme={theme} density={density}>
          <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
            <TimeSelection />
            <SceneComposerInternal
              query={query}
              sceneLoader={loader}
              sceneMetadataModule={sceneMetadataModule}
              config={config}
              externalLibraryConfig={externalLibraryConfig}
              queries={queries}
              valueDataBindingProviders={bindingProvider}
              onSceneUpdated={handleSceneUpdated}
              dataStreams={convertDataInputToDataStreams(getTestDataInputContinuous())}
              dataBindingTemplate={{
                'sel_entity': 'room1',
                'sel_comp': 'temperatureSensor1'
              }}  
              showAssetBrowserCallback={(cb) => {
                showAssetBrowserCallback()
                if (source == 'local') {
                  cb(null, 'PALLET_JACK.glb')
                } else {
                  cb(null, addModelUri)
                }
              }}
              {...props}
            />
          </SceneComposerContainer>
        </ThemeManager>
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
};
