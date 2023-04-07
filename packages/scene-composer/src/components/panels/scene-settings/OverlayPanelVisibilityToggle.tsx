import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Toggle } from '@awsui/components-react';

import { IDataOverlayComponentInternal, useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IComponentSettingsMap, IOverlaySettings, KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { componentSettingsSelector } from '../../../utils/componentSettingsUtils';
import { findComponentByType } from '../../../utils/nodeUtils';

export const OverlayPanelVisibilityToggle: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const overlayPanelVisible =
    useViewOptionState(sceneComposerId).componentVisibilities[Component.DataOverlaySubType.OverlayPanel];
  const toggleComponentVisibility = useViewOptionState(sceneComposerId).toggleComponentVisibility;
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const componentNodeMap = useStore(sceneComposerId)((state) => state.document.componentNodeMap);

  const documentSettings: IOverlaySettings = useStore(sceneComposerId)(
    (state) => componentSettingsSelector(state, KnownComponentType.DataOverlay) as IOverlaySettings,
  );

  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());

  // When the document settings is changed from other places (e.g. undo/redo),
  // sync the view options visibility value with document settings.
  useEffect(() => {
    if (!isViewing && !!overlayPanelVisible !== !!documentSettings.overlayPanelVisible) {
      toggleComponentVisibility(Component.DataOverlaySubType.OverlayPanel);
    }
  }, [documentSettings, isViewing]);

  const updateSettings = useCallback(
    (newValue: boolean) => {
      if (isViewing) return;

      const newSettings: IOverlaySettings = {
        overlayPanelVisible: newValue,
      };
      const newComponentSettings: IComponentSettingsMap = {
        ...getSceneProperty(KnownSceneProperty.ComponentSettings),
        [KnownComponentType.DataOverlay]: newSettings,
      };

      setSceneProperty(KnownSceneProperty.ComponentSettings, newComponentSettings);
    },
    [getSceneProperty, setSceneProperty, isViewing],
  );

  const hasOverlayPanel = useMemo(() => {
    const overlays = Object.keys(getComponentRefByType(KnownComponentType.DataOverlay));
    return overlays.find(
      (overlayRef) =>
        (
          findComponentByType(
            getSceneNodeByRef(overlayRef),
            KnownComponentType.DataOverlay,
          ) as IDataOverlayComponentInternal
        ).subType === Component.DataOverlaySubType.OverlayPanel,
    );
  }, [componentNodeMap, getComponentRefByType]);

  return (
    <>
      <Box variant='p' fontWeight='bold' margin={{ bottom: 'xxs' }}>
        {formatMessage({
          defaultMessage: 'Overlay',
          description: 'Sub section label',
        })}
      </Box>
      <Box variant='p' margin={{ bottom: 'xxs' }}>
        {formatMessage({
          defaultMessage: 'Visibility settings',
          description: 'Sub section label',
        })}
      </Box>
      <Toggle
        disabled={!hasOverlayPanel}
        checked={!!documentSettings.overlayPanelVisible}
        onChange={() => {
          updateSettings(!documentSettings.overlayPanelVisible);
        }}
      >
        {formatMessage({ description: 'Toggle label', defaultMessage: 'Always on' })}
      </Toggle>
    </>
  );
};
