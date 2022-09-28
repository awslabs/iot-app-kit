import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { colorBackgroundDropdownItemDefault } from '@awsui/design-tokens';

import { ToolbarItemGroup } from '../common/styledComponents';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../store';

import { HistoryItemGroup, ObjectItemGroup, SceneItemGroup, CancelMenuItem } from './items';

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
  return (
    <FloatingToolbarContainer>
      {!addingWidget && enableDefaultItems && (
        <ToolbarItemGroup>
          {!isViewing && <HistoryItemGroup />}
          <SceneItemGroup isViewing={isViewing} />
          {!isViewing && <ObjectItemGroup />}
        </ToolbarItemGroup>
      )}
      {!!addingWidget && enableDefaultItems && (
        <ToolbarItemGroup>
          <CancelMenuItem />
        </ToolbarItemGroup>
      )}
      {additionalMenuItems}
    </FloatingToolbarContainer>
  );
}
