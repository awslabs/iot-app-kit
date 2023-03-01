import React, { FC, useCallback, useRef } from 'react';
import { Mode, Density } from '@awsui/global-styles';
import styled from 'styled-components';

import {
  ExternalLibraryConfig,
  ISceneDocumentSnapshot,
  OnSceneUpdateCallback,
  OperationMode,
  SceneComposerInternal,
  SceneViewerPropsShared,
  useSceneComposerApi,
} from '../../src';
import { useMockedValueDataBindingProvider } from '../useMockedValueDataBindingProvider';

import ThemeManager, { ThemeManagerProps } from './theme-manager';
import useLoader from './hooks/useLoader';
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
  matterportModelId?: string;
  matterportApplicationKey?: string;
  onSceneUpdated?: OnSceneUpdateCallback;
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
  matterportModelId,
  matterportApplicationKey,
  ...props
}: SceneComposerWrapperProps) => {
  const stagedScene = useRef<ISceneDocumentSnapshot | undefined>(undefined);
  const scene = sceneId || localScene || 'scene1';
  const loader = useLoader(source, scene, awsCredentials, workspaceId, sceneId);

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

  const valueDataBindingProvider = useMockedValueDataBindingProvider();
  const sceneComposerApi = useSceneComposerApi(scene);

  const handleSceneUpdated = useCallback((sceneSnapshot) => {
    stagedScene.current = sceneSnapshot;
    onSceneUpdated(sceneSnapshot);
  }, []);

  if (loader) {
    return (
      <ThemeManager theme={theme} density={density}>
        <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
          {mode === 'Editing' && (
            <EditingToolbar getScene={() => stagedScene.current} sceneComposerApi={sceneComposerApi} />
          )}
          <SceneComposerInternal
            sceneLoader={loader}
            config={config as any}
            externalLibraryConfig={externalLibraryConfig}
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
