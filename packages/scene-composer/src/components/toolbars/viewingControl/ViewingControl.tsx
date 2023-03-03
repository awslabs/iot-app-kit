import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { colorBackgroundDropdownItemDefault } from '@awsui/design-tokens';
import { Button, Box, SpaceBetween } from '@awsui/components-react';

import { ToolbarItemGroup } from '../common/styledComponents';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useEditorState, useStore } from '../../../store';

const ViewingControlContainer = styled.div`
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
  z-index: 999;
  background-color: ${colorBackgroundDropdownItemDefault};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const PlaybackItem = styled.div`
  margin: 0 10px;
`;

export interface ViewingControlProps {
  additionalMenuItems?: ReactNode;
  enableDefaultItems?: boolean;
  isViewing?: boolean;
}

export function ViewingControl({ additionalMenuItems }: ViewingControlProps) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const playbackSpeed = useStore(sceneComposerId)((state) => state.playbackSpeed);
  const timeRange = useStore(sceneComposerId)((state) => state.dataInput?.timeRange);
  const playbackCursor = useStore(sceneComposerId)((state) => state.playbackCursor);
  const setPlaybackCursor = useStore(sceneComposerId)((state) => state.setPlaybackCursor);
  const incrementPlaybackCursor = useStore(sceneComposerId)((state) => state.incrementPlaybackCursor);
  const [isPlayback, setIsPlayback] = useState(false);
  const playbackIntervalRef = React.useRef<NodeJS.Timer>();

  const togglePlayback = useCallback(() => {
    setIsPlayback(!isPlayback);
  }, [isPlayback]);

  useEffect(() => {
    if (isPlayback) {
      playbackIntervalRef.current = setInterval(() => {
        // console.log('increment timer');
        incrementPlaybackCursor((playbackSpeed || 1) * 100);
      }, 100);
      return () => clearInterval(playbackIntervalRef.current);
    } else {
      clearInterval(playbackIntervalRef.current);
      setPlaybackCursor(0);
    }
  }, [isPlayback, incrementPlaybackCursor, setPlaybackCursor, playbackSpeed]);

  const timestamp = (timeRange?.from || 0) + (playbackCursor || 0);

  return (
    <ViewingControlContainer>
      <Button onClick={togglePlayback}>{isPlayback ? 'Stop' : 'Playback'}</Button>
      <PlaybackItem>{new Date(timestamp).toISOString()}</PlaybackItem>
    </ViewingControlContainer>
  );
}
