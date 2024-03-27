import React, { useContext, useMemo } from 'react';
import { Box, Toggle } from '@cloudscape-design/components';

import { IDataOverlayComponentInternal, useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { findComponentByType } from '../../../utils/nodeUtils';

export interface ComponentVisibilityToggleProps {
  componentType: KnownComponentType | Component.DataOverlaySubType;
  label: string;
  onChange?: (newValue: boolean) => void;
}

export const ComponentVisibilityToggle: React.FC<ComponentVisibilityToggleProps> = ({
  componentType,
  label,
  onChange,
}) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const toggleComponentVisibility = useViewOptionState(sceneComposerId).toggleComponentVisibility;
  const componentVisible = useViewOptionState(sceneComposerId).componentVisibilities[componentType];
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const componentNodeMap = useStore(sceneComposerId)((state) => state.document.componentNodeMap);

  const hasComponent = useMemo(() => {
    if (Component.DataOverlaySubType[componentType]) {
      const overlays = Object.keys(getComponentRefByType(KnownComponentType.DataOverlay));
      return overlays.find(
        (overlayRef) =>
          (
            findComponentByType(
              getSceneNodeByRef(overlayRef),
              KnownComponentType.DataOverlay,
            ) as IDataOverlayComponentInternal
          ).subType === componentType,
      );
    } else {
      return Object.keys(getComponentRefByType(componentType as KnownComponentType)).length > 0;
    }
  }, [componentNodeMap, getComponentRefByType]);

  return (
    <Box margin={{ vertical: 's' }}>
      <Box variant='p' margin={{ bottom: 'xxs' }} display='inline'>
        {label}
      </Box>
      <Box float='right'>
        <Toggle
          disabled={!hasComponent}
          checked={!!componentVisible}
          onChange={() => {
            toggleComponentVisibility(componentType);
            onChange?.(!componentVisible);
          }}
        />
      </Box>
    </Box>
  );
};
