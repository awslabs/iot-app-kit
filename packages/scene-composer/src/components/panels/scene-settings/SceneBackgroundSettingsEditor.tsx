import { Button, FormField, Input, SpaceBetween } from '@cloudscape-design/components';
import { useCallback, useContext, useEffect, useState, type FC } from 'react';
import { useIntl } from 'react-intl';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  COMPOSER_FEATURES,
  DEFAULT_SCENE_BACKGROUND_COLOR,
  type ISceneBackgroundSetting,
  KnownSceneProperty,
  TextureFileTypeList,
} from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { accessStore } from '../../../store';
import { parseS3BucketFromArn } from '../../../utils/pathUtils';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';

export const SceneBackgroundSettingsEditor: FC = () => {
  useLifecycleLogging('SceneBackgroundSettingsEditor');
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = accessStore(sceneComposerId)(
    (state) => state.setSceneProperty<ISceneBackgroundSetting | undefined>,
  );
  const backgroundSettings = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<ISceneBackgroundSetting>(KnownSceneProperty.SceneBackgroundSettings),
  );
  const showAssetBrowserCallback = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );

  const [internalColor, setInternalColor] = useState(backgroundSettings?.color || DEFAULT_SCENE_BACKGROUND_COLOR);
  const [internalUri, setInternalUri] = useState(backgroundSettings?.textureUri || '');
  const backgroundColors = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.BackgroundCustomColors, []),
  );
  const setBackgroundColorsSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  //set default and restore editor when background failed validiation elsewhere
  useEffect(() => {
    if (!backgroundSettings?.color && !backgroundSettings?.textureUri) {
      setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
        color: internalColor,
      });
    } else {
      if (backgroundSettings.color && backgroundSettings.color !== internalColor) {
        setInternalColor(backgroundSettings?.color);
      }
      if (backgroundSettings.textureUri && backgroundSettings.textureUri !== internalUri) {
        setInternalUri(backgroundSettings.textureUri);
      }
    }
  }, [backgroundSettings]);

  const onColorChange = useCallback(
    (color: string) => {
      if (color !== internalColor) {
        setInternalColor(color);
        setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
          color: color,
        });
      }
    },
    [internalColor],
  );

  const onTextureSelectClick = useCallback(() => {
    if (showAssetBrowserCallback) {
      showAssetBrowserCallback((s3BucketArn, contentLocation) => {
        let localTextureUri: string;
        if (s3BucketArn === null) {
          // This should be used for local testing only
          localTextureUri = contentLocation;
        } else {
          localTextureUri = `s3://${parseS3BucketFromArn(s3BucketArn)}/${contentLocation}`;
        }

        setInternalUri(localTextureUri);
        setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
          textureUri: localTextureUri,
        });
      }, TextureFileTypeList);
    } else {
      console.info('No asset browser available');
    }
  }, []);

  const onTextureRemoveClick = useCallback(() => {
    setInternalUri('');
    setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
      color: internalColor,
    });
  }, [internalColor]);

  return (
    <>
      <FormField label={intl.formatMessage({ defaultMessage: 'Scene Background', description: 'Form Field label' })}>
        <SpaceBetween size='s' direction='vertical'>
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
            <SpaceBetween size='s' direction='vertical'>
              <SpaceBetween size='s' direction='horizontal'>
                <Button data-testid='select-texture-button' onClick={onTextureSelectClick}>
                  {intl.formatMessage({ defaultMessage: 'Select Texture', description: 'select texture Button Text' })}
                </Button>
                {internalUri && (
                  <Button data-testid='remove-texture-button' onClick={onTextureRemoveClick}>
                    {intl.formatMessage({
                      defaultMessage: 'Remove Texture',
                      description: 'remove texture Button Text',
                    })}
                  </Button>
                )}
              </SpaceBetween>
              {internalUri && <Input value={internalUri} disabled />}
            </SpaceBetween>
          )}
        </SpaceBetween>
      </FormField>
    </>
  );
};
