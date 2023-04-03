import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Toggle } from '@awsui/components-react';

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
  const { formatMessage } = useIntl();

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
    <>
      <Box variant='p' fontWeight='bold' margin={{ bottom: 'xxs' }}>
        {label}
      </Box>
      <Toggle
        disabled={!hasComponent}
        checked={!!componentVisible}
        onChange={() => {
          toggleComponentVisibility(componentType);
          onChange?.(!componentVisible);
        }}
      >
        {formatMessage({ description: 'Toggle label', defaultMessage: 'Visibility' })}
      </Toggle>
    </>
  );
};
