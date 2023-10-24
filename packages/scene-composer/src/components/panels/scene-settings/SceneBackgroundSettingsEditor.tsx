import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, SpaceBetween } from '@awsui/components-react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { ISceneBackgroundSetting, KnownSceneProperty } from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';

export const SceneBackgroundSettingsEditor: React.FC = () => {
  useLifecycleLogging('SceneBackgroundSettingsEditor');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = useStore(sceneComposerId)(
    (state) => state.setSceneProperty<ISceneBackgroundSetting | undefined>,
  );
  const backgroundSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );

  const [backgroundEnabled, setBackgroundEnabled] = useState(!!backgroundSettings);
  const [internalColor, setInternalColor] = useState(backgroundSettings?.color || '#cccccc');
  const backgroundColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.BackgroundCustomColors, []),
  );
  const setBackgroundColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  const onToggleBackground = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
          color: internalColor,
        });
      } else {
        setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, undefined);
      }
      setBackgroundEnabled(checked);
    },
    [backgroundSettings, internalColor],
  );

  const onColorChange = useCallback(
    (color: string) => {
      if (color !== internalColor) {
        setInternalColor(color);
        if (backgroundEnabled) {
          setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
            color: color,
          });
        }
      }
    },
    [backgroundEnabled, internalColor],
  );

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <Checkbox
          data-testid='enable-background-checkbox'
          checked={!!backgroundSettings}
          onChange={(e) => onToggleBackground(e.detail.checked)}
        >
          {intl.formatMessage({ defaultMessage: 'Enable Background', description: 'checkbox label' })}
        </Checkbox>
        {!!backgroundSettings && (
          <ColorSelectorCombo
            color={internalColor}
            onSelectColor={(pickedColor) => onColorChange(pickedColor)}
            onUpdateCustomColors={(chosenCustomColors) =>
              setBackgroundColorsSceneProperty(KnownSceneProperty.BackgroundCustomColors, chosenCustomColors)
            }
            customColors={backgroundColors}
            colorPickerLabel={intl.formatMessage({ defaultMessage: 'Color', description: 'Color' })}
            customColorLabel={intl.formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
          />
        )}
      </SpaceBetween>
    </React.Fragment>
  );
};
