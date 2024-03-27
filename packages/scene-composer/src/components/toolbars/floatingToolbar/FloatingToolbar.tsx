import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colorBackgroundDropdownItemDefault } from '@cloudscape-design/design-tokens';

import { ToolbarItemGroup } from '../common/styledComponents';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../store';
import { ToolbarOrientation } from '../common/types';

import { HistoryItemGroup, ObjectItemGroup, SceneItemGroup, CancelMenuItem } from './items';

export const FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER = 10;

const FloatingToolbarContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  user-select: none;
  z-index: 999;
  background-color: ${colorBackgroundDropdownItemDefault};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

export interface FloatingToolbarProps {
  additionalMenuItems?: ReactNode;
  enableDefaultItems?: boolean;
  isViewing?: boolean;
}

export function FloatingToolbar({
  additionalMenuItems,
  enableDefaultItems = true,
  isViewing = false,
}: FloatingToolbarProps) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { addingWidget } = useEditorState(sceneComposerId);
  const [toolbarOrientation, setToolbarOrientation] = useState<ToolbarOrientation>(ToolbarOrientation.Vertical);
  const [toolbarHeightPx, setToolbarHeightPx] = useState(0);
  const [canvasHeightPx, setCanvasHeightPx] = useState<number | undefined>(undefined);
  const canvas = document.getElementById('tm-scene-unselectable-canvas') as HTMLCanvasElement | null;

  useEffect(() => {
    const handleResize = () => {
      if (canvas && canvas.clientHeight) setCanvasHeightPx(canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas?.clientHeight]);

  useEffect(() => {
    if (canvasHeightPx) {
      if (toolbarHeightPx > canvasHeightPx - FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER) {
        setToolbarOrientation(ToolbarOrientation.Horizontal);
      } else {
        setToolbarOrientation(ToolbarOrientation.Vertical);
      }
    }
  }, [canvasHeightPx, toolbarHeightPx]);

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setToolbarHeightPx(node.clientHeight);
    }
  }, []);

  return (
    <FloatingToolbarContainer ref={measuredRef}>
      {!addingWidget && enableDefaultItems && (
        <ToolbarItemGroup isVertical={toolbarOrientation === ToolbarOrientation.Vertical}>
          {!isViewing && <HistoryItemGroup toolbarOrientation={toolbarOrientation} />}
          <SceneItemGroup isViewing={isViewing} toolbarOrientation={toolbarOrientation} canvasHeight={canvasHeightPx} />
          {!isViewing && <ObjectItemGroup toolbarOrientation={toolbarOrientation} canvasHeight={canvasHeightPx} />}
        </ToolbarItemGroup>
      )}
      {!!addingWidget && enableDefaultItems && (
        <ToolbarItemGroup isVertical={toolbarOrientation === ToolbarOrientation.Vertical}>
          <CancelMenuItem />
        </ToolbarItemGroup>
      )}
      {additionalMenuItems}
    </FloatingToolbarContainer>
  );
}
