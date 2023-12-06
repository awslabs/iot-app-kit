import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Checkbox, FormField, Input, SpaceBetween } from '@awsui/components-react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, ISceneBackgroundSetting, KnownSceneProperty } from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';
import { parseS3BucketFromArn } from '../../../utils/pathUtils';

export const SceneBackgroundSettingsEditor: React.FC = () => {
  useLifecycleLogging('SceneBackgroundSettingsEditor');
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = useStore(sceneComposerId)(
    (state) => state.setSceneProperty<ISceneBackgroundSetting | undefined>,
  );
  const backgroundSettings = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );
  const showAssetBrowserCallback = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );

  const [backgroundEnabled, setBackgroundEnabled] = useState(!!backgroundSettings);
  const [internalColor, setInternalColor] = useState(backgroundSettings?.color || '#cccccc');
  const [internalUri, setInternalUri] = useState(backgroundSettings?.textureUri || '');
  const backgroundColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.BackgroundCustomColors, []),
  );
  const setBackgroundColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  const onToggleBackground = useCallback(
    (checked: boolean) => {
      if (checked) {
        internalUri
          ? setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
              textureUri: internalUri,
            })
          : setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
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

  const onTextureSelectClick = useCallback(() => {
    if (showAssetBrowserCallback) {
      showAssetBrowserCallback((s3BucketArn, contentLocation) => {
        let textureUri: string;
        if (s3BucketArn === null) {
          // This should be used for local testing only
          textureUri = contentLocation;
        } else {
          textureUri = `s3://${parseS3BucketFromArn(s3BucketArn)}/${contentLocation}`;
        }

        setInternalUri(textureUri);
        if (backgroundEnabled) {
          setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
            textureUri: textureUri,
          });
        }
      });
    } else {
      console.info('No asset browser available');
    }
  }, [backgroundEnabled]);

  const onTextureRemoveClick = useCallback(() => {
    setInternalUri('');
    if (backgroundEnabled) {
      setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
        color: internalColor,
      });
    }
  }, [backgroundEnabled, internalColor]);

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
        {!!backgroundSettings && (!backgroundSettings.textureUri || !texturesEnabled) && (
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
        {!!backgroundSettings && texturesEnabled && (
          <SpaceBetween size='s' direction='horizontal'>
            <Button data-testid='select-texture-button' onClick={onTextureSelectClick}>
              {intl.formatMessage({ defaultMessage: 'Select Texture', description: 'select texture Button Text' })}
            </Button>
            {internalUri && (
              <Button data-testid='remove-texture-button' onClick={onTextureRemoveClick}>
                {intl.formatMessage({ defaultMessage: 'Remove Texture', description: 'remove texture Button Text' })}
              </Button>
            )}
            <Input value={internalUri} disabled />
          </SpaceBetween>
        )}
      </SpaceBetween>
    </React.Fragment>
  );
};
