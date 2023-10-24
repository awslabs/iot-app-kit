import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, FormField, Input, SpaceBetween } from '@awsui/components-react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IFogSettings, KnownSceneProperty } from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';

export const FogSettingsEditor: React.FC = () => {
  useLifecycleLogging('FogSettingsEditor');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<IFogSettings | undefined>);
  const fogSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<IFogSettings>(KnownSceneProperty.FogSettings),
  );

  const [fogEnabled, setFogEnabled] = useState(!!fogSettings);
  const [internalColor, setInternalColor] = useState(fogSettings?.color || '#cccccc');
  const [internalNearDistance, setInternalNearDistance] = useState(fogSettings?.near || 1);
  const [internalFarDistance, setInternalFarDistance] = useState(fogSettings?.far || 1000);

  const fogColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.FogCustomColors, []),
  );
  const setFogColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  const onToggleFog = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSceneProperty(KnownSceneProperty.FogSettings, {
          color: internalColor,
          near: internalNearDistance,
          far: internalFarDistance,
        });
      } else {
        setSceneProperty(KnownSceneProperty.FogSettings, undefined);
      }
      setFogEnabled(checked);
    },
    [fogSettings, internalColor, internalNearDistance, internalFarDistance],
  );

  const onInputBlur = useCallback(() => {
    if (fogEnabled && (fogSettings?.near !== internalNearDistance || fogSettings?.far !== internalFarDistance)) {
      setSceneProperty(KnownSceneProperty.FogSettings, {
        color: internalColor,
        near: internalNearDistance,
        far: internalFarDistance,
      });
    }
  }, [fogEnabled, internalColor, internalNearDistance, internalFarDistance]);

  const onColorChange = useCallback(
    (color: string) => {
      if (color !== internalColor) {
        setInternalColor(color);
        if (fogEnabled) {
          setSceneProperty(KnownSceneProperty.FogSettings, {
            color: color,
            near: internalNearDistance,
            far: internalFarDistance,
          });
        }
      }
    },
    [fogEnabled, internalColor, internalNearDistance, internalFarDistance],
  );

  const onNearChange = useCallback(
    (event) => {
      const value = Number(event.detail.value);
      if (value !== internalNearDistance) {
        setInternalNearDistance(value);
      }
    },
    [internalNearDistance],
  );

  const onFarChange = useCallback(
    (event) => {
      const value = Number(event.detail.value);
      if (value !== internalFarDistance) {
        setInternalFarDistance(value);
      }
    },
    [internalFarDistance],
  );

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <Checkbox
          data-testid='enable-fog-checkbox'
          checked={!!fogSettings}
          onChange={(e) => onToggleFog(e.detail.checked)}
        >
          {intl.formatMessage({ defaultMessage: 'Enable Fog', description: 'checkbox label' })}
        </Checkbox>
        {!!fogSettings && (
          <>
            <ColorSelectorCombo
              color={internalColor}
              onSelectColor={(pickedColor) => onColorChange(pickedColor)}
              onUpdateCustomColors={(chosenCustomColors) =>
                setFogColorsSceneProperty(KnownSceneProperty.FogCustomColors, chosenCustomColors)
              }
              customColors={fogColors}
              colorPickerLabel={intl.formatMessage({ defaultMessage: 'Color', description: 'Color' })}
              customColorLabel={intl.formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
            />
            <FormField label={intl.formatMessage({ defaultMessage: 'Near Distance', description: 'Form Field label' })}>
              <Input
                data-testid='fog-near-input'
                value={String(internalNearDistance)}
                type='number'
                onBlur={onInputBlur}
                onChange={onNearChange}
                onKeyDown={(e) => {
                  if (e.detail.key === 'Enter') onInputBlur();
                }}
              />
            </FormField>
            <FormField label={intl.formatMessage({ defaultMessage: 'Far Distance', description: 'Form Field label' })}>
              <Input
                data-testid='fog-far-input'
                value={String(internalFarDistance)}
                type='number'
                onBlur={onInputBlur}
                onChange={onFarChange}
                onKeyDown={(e) => {
                  if (e.detail.key === 'Enter') onInputBlur();
                }}
              />
            </FormField>
          </>
        )}
      </SpaceBetween>
    </React.Fragment>
  );
};
