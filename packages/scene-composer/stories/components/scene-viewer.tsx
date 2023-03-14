import React, { FC } from 'react';

import { SceneViewerPropsShared } from '../../src';

import { ThemeManagerProps } from './theme-manager';
import SceneComposerWrapper from './scene-composer';
import { viewerArgTypes } from './argTypes';

interface StorybookSceneViewerProps extends SceneViewerPropsShared, ThemeManagerProps {
  sceneSource: 'local' | 'aws';
  dataSource: 'local' | 'aws';
  awsRegion?: string;
  scene?: string;
  sceneId?: string;
  awsCredentials?: any;
  workspaceId?: string;
  features?: string[];
  locale: string;
}

const SceneViewerWrapper: FC<StorybookSceneViewerProps> = ({ ...props }: StorybookSceneViewerProps) => {
  return <SceneComposerWrapper mode='Viewing' {...props} />;
};

export default SceneViewerWrapper;

export const argTypes = viewerArgTypes;
