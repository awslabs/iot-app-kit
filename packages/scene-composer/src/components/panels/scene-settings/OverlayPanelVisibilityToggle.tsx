import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Toggle } from '@cloudscape-design/components';

import { IDataOverlayComponentInternal, accessStore, useViewOptionState } from '../../../store';
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
  const getComponentRefByType = accessStore(sceneComposerId)((state) => state.getComponentRefByType);
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const componentNodeMap = accessStore(sceneComposerId)((state) => state.document.componentNodeMap);

  const documentSettings: IOverlaySettings = accessStore(sceneComposerId)(
    (state) => componentSettingsSelector(state, KnownComponentType.DataOverlay) as IOverlaySettings,
  );

  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);
  const getSceneProperty = accessStore(sceneComposerId)((state) => state.getSceneProperty);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());

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
        onChange={(event) => {
          updateSettings(event.detail.checked);
        }}
      >
        {formatMessage({ description: 'Toggle label', defaultMessage: 'Always on' })}
      </Toggle>
    </>
  );
};
