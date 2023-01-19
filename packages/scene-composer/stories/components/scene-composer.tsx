import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Mode, Density } from '@awsui/global-styles';
import { Viewport } from '@iot-app-kit/core';
import styled from 'styled-components';

import {
  ISceneDocumentSnapshot,
  OnSceneUpdateCallback,
  OperationMode,
  PropertyDecoderFunction,
  PropertyDecoderFunctionMap,
  SceneComposerInternal,
  SceneViewerPropsShared,
  useSceneComposerApi,
} from '../../src';
import { useMockedValueDataBindingProvider } from '../useMockedValueDataBindingProvider';

import ThemeManager, { ThemeManagerProps } from './theme-manager';
import useLoader from './hooks/useLoader';
import useDataSource from './hooks/useDatasource';
import { mapFeatures } from './utils';
import { viewerArgTypes } from './argTypes';
import EditingToolbar from './toolbars/EditingToolbar';

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
  awsCredentials?: any;
  workspaceId?: string;
  features?: string[];
  mode?: OperationMode;
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
  sceneLoader: ignoredLoader,
  onSceneUpdated = () => {},
  viewportDurationSecs,
  queriesJSON,
  ...props
}: SceneComposerWrapperProps) => {
    const [viewport, setViewport] = useState<Viewport>();
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene1';
  const datasource = useDataSource(awsCredentials, workspaceId);
  const loader = useLoader(source, scene, datasource.s3SceneLoader, sceneId);

  const config = {
    dracoDecoder: {
      enable: true,
    },
    mode,
    colorTheme: theme,
    featureConfig: mapFeatures(features),
  };

  const locationStringDecoder: PropertyDecoderFunction = useCallback((locationString: string) => {
    const newLocationValues = locationString.split(',');
    return { 
      positionX: Number(newLocationValues[0]), 
      positionY: Number(newLocationValues[1]),
      positionZ: Number(newLocationValues[2]),
      rotationDegX: Number(newLocationValues[3]),
      rotationDegY: Number(newLocationValues[4]),
      rotationDegZ: Number(newLocationValues[5]),
    }
  },[]);

  /*const propertyDecoders: PropertyDecoderFunctionMap = {
    'locationString': locationStringDecoder,
  };*/

  useEffect(() => {
    const duration = viewportDurationSecs ?? 300; // default 5 minutes
    setViewport({
      duration: `${Math.ceil(duration/60)}m`
    })
    console.log('setting viewport');
    // Example of how to use viewport with setInterval instead of using the duration field
    /*const intervalId = setInterval(() => {
      const now = new Date();
      setViewport({
        start: new Date(now.getTime() - duration * 1000),
        end: now,
      });
      
      console.log('viewport as: ', viewport);
    }, 1000);*

    return () => clearInterval(intervalId);
    */
  }, [viewportDurationSecs]);
  
  console.log('datasource query function: ', datasource.query);

  const queries = queriesJSON
    ? JSON.parse(queriesJSON).map((q) => {
        console.log('q: ', q);
        const data = datasource.query.timeSeriesData(q);
        console.log('data: ', data);
        return data;
      })
    : undefined;
  console.log('queries results :', queries);

  const valueDataBindingProvider = useMockedValueDataBindingProvider();
  console.log('data binding used: ', valueDataBindingProvider);
  const sceneComposerApi = useSceneComposerApi(scene);

  const handleSceneUpdated = useCallback((sceneSnapshot) => {
    stagedScene.current = sceneSnapshot;
    onSceneUpdated(sceneSnapshot);
  }, []);

  if (loader) {
    return (
      <ThemeManager theme={theme} density={density}>
        <SceneComposerContainer data-testid={'webgl-root'} className='sceneViewer'>
          {mode === 'Editing' && (
            <EditingToolbar getScene={() => stagedScene.current} sceneComposerApi={sceneComposerApi} />
          )}
          <SceneComposerInternal
            sceneLoader={loader}
            config={config as any}
            propertyDecoders={locationStringDecoder}
            viewport={viewport}
            queries={queries}
            valueDataBindingProvider={valueDataBindingProvider}
            onSceneUpdated={handleSceneUpdated}
            {...props}
          />
        </SceneComposerContainer>
      </ThemeManager>
    );
  }

  return <div>Configure your AWS Credentials in the control panel, or switch to local scene to render</div>;
};

export default SceneComposerWrapper;

export const argTypes = {
  ...viewerArgTypes,
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
