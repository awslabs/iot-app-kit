import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Mode, Density } from '@awsui/global-styles';
import { Viewport } from '@iot-app-kit/core';
import styled from 'styled-components';

import {
  ExternalLibraryConfig,
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
  sceneSource: 'local' | 'aws';
  dataSource: 'local' | 'aws';
  awsRegion?: string;
  scene?: string;
  sceneId?: string;
  awsCredentials?: any;
  workspaceId?: string;
  features?: string[];
  mode?: OperationMode;
  matterportModelId?: string;
  matterportApplicationKey?: string;
  onSceneUpdated?: OnSceneUpdateCallback;
  viewportDurationSecs?: number;
  viewportStart?: string;
  queriesJSON?: string;
}

const locationStringDecoder: PropertyDecoderFunction = (locationString: string) => {
  const newLocationValues = locationString.split(',');
  return {
    positionX: Number(newLocationValues[0]),
    positionY: Number(newLocationValues[1]),
    positionZ: Number(newLocationValues[2]),
    rotationDegX: Number(newLocationValues[3]),
    rotationDegY: Number(newLocationValues[4]),
    rotationDegZ: Number(newLocationValues[5]),
  };
};

const SceneComposerWrapper: FC<SceneComposerWrapperProps> = ({
  sceneSource = 'local',
  dataSource = 'local',
  awsRegion = 'us-west-2',
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
  matterportModelId,
  matterportApplicationKey,
  viewportStart = '2023-03-11T00:31:30',
  viewportDurationSecs = 300,
  queriesJSON = `[
    {
      "entityId": "b20b93e3-2244-4561-afb9-f5fddaf326bc",
      "componentName": "sitewiseBase",
      "properties": [
        {
          "propertyName": "Property_84775815-a5fa-446a-9502-3629a2f303b2"
        }
      ]
    },
    {
      "entityId": "d41aae61-757d-4568-919c-7c183608842f",
      "componentName": "sitewiseBase",
      "properties": [
        {
          "propertyName": "Property_bfb4a8aa-33d4-4e07-97d0-95feaa0210fb"
        }
      ]
    },
    {
      "entityId": "c3bb25e0-a495-4781-b870-5bbe7b0f5a11",
      "componentName": "sitewiseBase",
      "properties": [
        {
          "propertyName": "Property_bfb4a8aa-33d4-4e07-97d0-95feaa0210fb"
        }
      ]
    }
  ]`,
  ...props
}: SceneComposerWrapperProps) => {
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene1';
  const datasource = useDataSource(awsCredentials, awsRegion, workspaceId);
  const loader = useLoader(sceneSource, scene, awsCredentials, awsRegion, workspaceId, sceneId);
  const duration = viewportDurationSecs;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const loadModelResultCallback = useRef<(s3bucketArn: string | null, selectedAssetContentLocation: string) => void>(
    () => {},
  );

  const config = {
    dracoDecoder: {
      enable: true,
    },
    mode,
    colorTheme: theme,
    featureConfig: mapFeatures(features),
  };

  let externalLibraryConfig: ExternalLibraryConfig | undefined;

  if (matterportModelId) {
    externalLibraryConfig = {
      matterport: {
        modelId: matterportModelId,
        applicationKey: matterportApplicationKey,
      },
    };
  }

  const startTime = viewportStart ? new Date(viewportStart) : new Date(new Date().getTime() - duration * 1000);
  const endTime = new Date(startTime.getTime() + duration * 1000);

  const viewport = {
    start: startTime,
    end: endTime,
  };

  const queries = queriesJSON
    ? JSON.parse(queriesJSON).map((q) => {
        const data = datasource.query.timeSeriesData(q);
        return data;
      })
    : undefined;

  const propertyDecoders: PropertyDecoderFunctionMap = {
    locationString: locationStringDecoder,
  };

  // useEffect(() => {
  //   const duration = viewportDurationSecs ?? 300; // default 5 minutes
  //   setViewport({
  //     duration: `${Math.ceil(duration / 60)}m`,
  //   });
  //   console.log('setting viewport');
  //   // Example of how to use viewport with setInterval instead of using the duration field
  //   /*const intervalId = setInterval(() => {
  //     const now = new Date();
  //     setViewport({
  //       start: new Date(now.getTime() - duration * 1000),
  //       end: now,
  //     });

  //     console.log('viewport as: ', viewport);
  //   }, 1000);*

  //   return () => clearInterval(intervalId);
  //   */
  // }, [viewportDurationSecs]);

  // console.log('datasource query function: ', datasource.query);

  // const queries = queriesJSON
  //   ? JSON.parse(queriesJSON).map((q) => {
  //       console.log('q: ', q);
  //       const data = datasource.query.timeSeriesData(q);
  //       console.log('data: ', data);
  //       return data;
  //     })
  //   : undefined;
  // console.log('queries results :', queries);

  const valueDataBindingProvider = useMockedValueDataBindingProvider();
  console.log('data binding used: ', valueDataBindingProvider);
  const sceneComposerApi = useSceneComposerApi(scene);

  const handleSceneUpdated = useCallback((sceneSnapshot) => {
    stagedScene.current = sceneSnapshot;
    onSceneUpdated(sceneSnapshot);
  }, []);

  const handleShowAssetBrowser = useCallback((resultCallback) => {
    console.log('show asset browser callback');
    loadModelResultCallback.current = resultCallback;
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const onFileUploadChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files?.[0];

    if (loadModelResultCallback.current && file?.name) {
      console.log('file: ', file.name);
      loadModelResultCallback.current(null, file.name);
    }
    // file?.text().then((sceneText) => {
    //   setSceneFileLocal(sceneText);
    // });
  }, []);

  if (loader) {
    return (
      <ThemeManager theme={theme} density={density}>
        <input hidden id='loadModelInput' ref={fileRef} type='file' onChange={onFileUploadChange} accept='*' />
        <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
          {mode === 'Editing' && (
            <EditingToolbar getScene={() => stagedScene.current} sceneComposerApi={sceneComposerApi} />
          )}
          <SceneComposerInternal
            sceneLoader={loader}
            config={config as any}
            externalLibraryConfig={externalLibraryConfig}
            propertyDecoders={propertyDecoders}
            viewport={viewport}
            queries={queries}
            valueDataBindingProvider={valueDataBindingProvider}
            onSceneUpdated={handleSceneUpdated}
            {...props}
            showAssetBrowserCallback={handleShowAssetBrowser}
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
  localModelToLoad: {
    if: { arg: 'sceneSource', eq: 'local' },
    table: { category: 'Scene' },
    control: 'text',
  },
};
