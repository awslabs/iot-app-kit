import { type FC, useCallback } from 'react';
import { Button, Container } from '@cloudscape-design/components';
import styled from 'styled-components';

import { useSceneComposerApi } from '../../src';

import SceneViewerWrapper, { type StorybookSceneViewerProps } from './scene-viewer';
import { viewerArgTypes } from './argTypes';

const SceneViewerContainer = styled.div`
  position: relative;
  min-height: 680px;
  min-width: 1200px;
  resize: both;
  overflow: auto;
`;

const HighlightTestWrapper: FC<StorybookSceneViewerProps> = ({ ...props }: StorybookSceneViewerProps) => {
  const composerApi = useSceneComposerApi('default');

  const setBlue = useCallback(() => {
    composerApi.highlights([
      {
        dataBindingContext: {
          entityId: 'WaterTank',
        },
        style: {
          color: 'blue',
        },
      },
    ]);
  }, [composerApi]);

  const setRed = useCallback(() => {
    composerApi.highlights([
      {
        dataBindingContext: {
          entityId: 'MainPipe',
        },
        style: {
          color: 'red',
        },
      },
    ]);
  }, [composerApi]);

  const setTranslucent = useCallback(() => {
    composerApi.highlights([
      {
        dataBindingContext: {
          entityId: 'WaterTank',
        },
        style: {
          opacity: 0.5,
          transparent: true,
        },
      },
    ]);
  }, [composerApi]);

  const clearAll = useCallback(() => {
    composerApi.clearHighlights([
      {
        entityId: 'WaterTank',
      },
      {
        entityId: 'MainPipe',
      },
    ]);
  }, [composerApi]);

  return (
    <Container>
      <Button onClick={setBlue}>Set Tank Blue</Button>
      <Button onClick={setRed}>Set Pipe Red</Button>
      <Button onClick={setTranslucent}>Set Tank Translucent</Button>
      <Button onClick={clearAll}>Clear All</Button>
      <SceneViewerContainer>
        <SceneViewerWrapper {...props} sceneComposerId='default' />
      </SceneViewerContainer>
    </Container>
  );
};

export default HighlightTestWrapper;

export const argTypes = viewerArgTypes;
