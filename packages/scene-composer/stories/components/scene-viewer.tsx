import { initialize, SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import React, { FC, useEffect, useMemo } from 'react';
import str2ab from 'string-to-arraybuffer';
import { Mode, applyDensity, Density } from '@awsui/global-styles';

import { SceneViewer, SceneViewerPropsShared } from '../../src';
import { testScenes } from '../../tests/testData';
import { setDebugMode } from '../../src/common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../src/interfaces/feature';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';

interface StorybookSceneViewerProps extends SceneViewerPropsShared {
  source: 'local' | 'aws';
  scene?: string;
  sceneId?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsSessionToken?: string;
  workspaceId?: string;
  mode?: string;
  density?: string;
  features?: string[];
}

const SceneViewerWrapper: FC<StorybookSceneViewerProps> = ({
  source = 'local',
  scene,
  mode = Mode.Dark,
  density = Density.Comfortable,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsSessionToken,
  workspaceId,
  sceneId,
  features = [],
  sceneLoader: ignoredLoader,
  ...props
}: StorybookSceneViewerProps) => {
  const localLoader = useMemo(() => {
    return {
      getSceneUri: () => Promise.resolve(scene),
      getSceneObject: () => Promise.resolve<ArrayBuffer>(str2ab(testScenes[scene!])),
    } as SceneLoader;
  }, [scene]);

  const awsLoader = useMemo(() => {
    const credentials = {
      accessKeyId: awsAccessKeyId!,
      secretAccessKey: awsSecretAccessKey!,
      sessionToken: awsSessionToken!,
    };

    const init = initialize(workspaceId!, {
      awsCredentials: credentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    const loader = init.s3SceneLoader(sceneId!);

    return loader as SceneLoader;
  }, [awsAccessKeyId, awsSecretAccessKey, awsSessionToken, workspaceId, sceneId]);

  useEffect(() => {
    applyDensity(density as Density);
  }, [density]);

  useEffect(() => {
    setDebugMode();
  }, []);

  const config = {
    dracoDecoder: {
      enable: true,
    },
    colorTheme: mode,
    featureConfig: Object.values(COMPOSER_FEATURES).reduce((acc, feature) => {
      acc[feature] = features.includes(feature);
      return acc;
    }, {}),
  };

  if (source === 'local') {
    return <SceneViewer sceneLoader={localLoader} config={config} {...props} />;
  } else {
    if (!!awsAccessKeyId && !!awsSecretAccessKey && !!awsSessionToken && !!workspaceId && !!sceneId) {
      return <SceneViewer sceneLoader={awsLoader} config={config} {...props} />;
    }
  }

  return <div>Configure your AWS Credentials in the control panel, or switch to local scene to render</div>;
};

export default SceneViewerWrapper;

export const argTypes = {
  source: {
    options: ['local', 'aws'],
    control: 'inline-radio',
    table: { category: 'Scene' },
  },
  // if local scene
  scene: {
    options: Object.keys(testScenes),
    control: 'select',
    table: { category: 'Scene' },
    if: { arg: 'source', eq: 'local' },
  },
  // if aws scene
  awsAccessKeyId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  awsSecretAccessKey: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  awsSessionToken: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  workspaceId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  sceneId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  mode: {
    options: Object.values(Mode),
    control: 'inline-radio',
    table: { category: 'Theme' },
  },
  density: {
    options: Object.values(Density),
    control: 'inline-radio',
    table: { category: 'Theme' },
  },
  features: {
    options: Object.values(COMPOSER_FEATURES),
    control: 'check',
    table: { category: 'Advanced' },
  },
  onSelectionChanged: {
    action: 'selection-changed',
    table: { category: 'Events' },
  },
  onWidgetClick: {
    action: 'widget-clicked',
    table: { category: 'Events' },
  },
};
