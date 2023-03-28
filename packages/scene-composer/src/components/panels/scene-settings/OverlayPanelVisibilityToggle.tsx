import React, { useCallback, useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IComponentSettingsMap, IOverlaySettings, KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { componentSettingsSelector } from '../../../utils/componentSettingsUtils';

import { ComponentVisibilityToggle } from './ComponentVisibilityToggle';

export const OverlayPanelVisibilityToggle: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const overlayPanelVisible =
    useViewOptionState(sceneComposerId).componentVisibilities[Component.DataOverlaySubType.OverlayPanel];
  const toggleComponentVisibility = useViewOptionState(sceneComposerId).toggleComponentVisibility;

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

  return (
    <ComponentVisibilityToggle
      onChange={updateSettings}
      componentType={Component.DataOverlaySubType.OverlayPanel}
      label={formatMessage({
        defaultMessage: 'Overlay',
        description: 'Sub section label',
      })}
    />
  );
};
