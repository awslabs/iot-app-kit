import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Mode, Density } from '@awsui/global-styles';
import styled from 'styled-components';
import { CredentialProvider, Credentials } from '@aws-sdk/types';
import { Viewport } from '@iot-app-kit/core';

import {
  ExternalLibraryConfig,
  ISceneDocumentSnapshot,
  OnSceneUpdateCallback,
  OperationMode,
  SceneComposerInternal,
  SceneViewerPropsShared,
} from '../../src';
import { useMockedValueDataBindingProvider } from '../useMockedValueDataBindingProvider';
import { convertDataInputToDataStreams, getTestDataInputContinuous } from '../../tests/testData';

import ThemeManager, { ThemeManagerProps } from './theme-manager';
import useLoader from './hooks/useLoader';
import useSceneMetadataModule from './hooks/useSceneMetadataModule';
import { mapFeatures } from './utils';
import { viewerArgTypes } from './argTypes';
import useDataSource from './hooks/useDatasource';

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
  features?: string[];
  mode: OperationMode;
  matterportModelId?: string;
  matterportApplicationKey?: string;
  onSceneUpdated?: OnSceneUpdateCallback;
  viewportDurationSecs?: number;
  queriesJSON?: string;
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
  onSceneUpdated = () => {},
  matterportModelId,
  matterportApplicationKey,
  viewportDurationSecs,
  queriesJSON,
  ...props
}: SceneComposerWrapperProps) => {
  const [viewport, setViewport] = useState<Viewport>();
  const duration = viewportDurationSecs ? viewportDurationSecs : 300; //default 5 minutes
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene_1';
  const datasource = useDataSource(awsCredentials, workspaceId);
  const loader = useLoader(source, scene, datasource.s3SceneLoader, sceneId);
  const sceneMetadataModule = useSceneMetadataModule({ source, scene, awsCredentials, workspaceId, sceneId });

  const config = {
    dracoDecoder: {
      enable: true,
    },
    mode,
    colorTheme: theme,
    featureConfig: mapFeatures(features),
  };

  useEffect(() => {
    let intervalId;
    // if using a custom query instead of mock poll the view port
    if (queriesJSON) {
      intervalId = setInterval(() => {
        const now = new Date();
        setViewport({
          start: new Date(now.getTime() - duration * 1000),
          end: now,
        });
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setViewport({
        start: new Date(getTestDataInputContinuous().timeRange.from),
        end: new Date(getTestDataInputContinuous().timeRange.to),
      });
      clearInterval(intervalId);
    }
  }, [viewport, queriesJSON, duration]);

  const queries = queriesJSON
    ? JSON.parse(queriesJSON).map((q) => {
        const data = datasource.query.timeSeriesData(q);
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

  const valueDataBindingProvider = useMockedValueDataBindingProvider();

  const handleSceneUpdated = useCallback((sceneSnapshot) => {
    stagedScene.current = sceneSnapshot;
    onSceneUpdated(sceneSnapshot);
  }, []);

  if (loader) {
    return (
      <ThemeManager theme={theme} density={density}>
        <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
          <SceneComposerInternal
            sceneLoader={loader}
            sceneMetadataModule={sceneMetadataModule}
            config={config}
            externalLibraryConfig={externalLibraryConfig}
            viewport={viewport}
            queries={queries}
            valueDataBindingProvider={valueDataBindingProvider}
            onSceneUpdated={handleSceneUpdated}
            dataStreams={convertDataInputToDataStreams(getTestDataInputContinuous())}
            {...props}
          />
        </SceneComposerContainer>
      </ThemeManager>
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
