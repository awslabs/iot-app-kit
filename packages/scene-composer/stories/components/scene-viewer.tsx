import React, { FC } from 'react';

import { SceneViewerPropsShared, COMPOSER_FEATURES } from '../../src';

import SceneComposerWrapper from './scene-composer';
import { viewerArgTypes } from './argTypes';

export interface StorybookSceneViewerProps extends SceneViewerPropsShared {
  source: 'local' | 'aws';
  scene?: string;
  sceneId?: string;
  awsCredentials?: any;
  workspaceId?: string;
  features?: COMPOSER_FEATURES[];
  locale: string;
}

const SceneViewerWrapper: FC<StorybookSceneViewerProps> = ({ ...props }: StorybookSceneViewerProps) => {
  return <SceneComposerWrapper mode='Viewing' {...props} />;
};

export default SceneViewerWrapper;

export const argTypes = viewerArgTypes;
