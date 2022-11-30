import React, { FC } from 'react';

import { SceneViewerPropsShared } from '../../src';

import { ThemeManagerProps } from './theme-manager';
import SceneComposerWrapper from './scene-composer';
import { viewerArgs } from './argTypes';

interface StorybookSceneViewerProps extends SceneViewerPropsShared, ThemeManagerProps {
  source: 'local' | 'aws';
  scene?: string;
  sceneId?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsSessionToken?: string;
  workspaceId?: string;
  features?: string[];
  locale: string;
}

const SceneViewerWrapper: FC<StorybookSceneViewerProps> = ({ ...props }: StorybookSceneViewerProps) => {
  return <SceneComposerWrapper mode='Viewing' {...props} />;
};

export default SceneViewerWrapper;

export const argTypes = viewerArgs;
