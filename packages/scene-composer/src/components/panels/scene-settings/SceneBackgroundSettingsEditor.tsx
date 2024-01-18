import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button, FormField, Input, SpaceBetween } from '@awsui/components-react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  COMPOSER_FEATURES,
  ISceneBackgroundSetting,
  KnownSceneProperty,
  TextureFileTypeList,
} from '../../../interfaces';
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

  const [internalColor, setInternalColor] = useState(backgroundSettings?.color || '#2a2e33');
  const [internalUri, setInternalUri] = useState(backgroundSettings?.textureUri || '');
  const backgroundColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.BackgroundCustomColors, []),
  );
  const setBackgroundColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  //set default
  useEffect(() => {
    if (!backgroundSettings?.color && !backgroundSettings?.textureUri) {
      setSceneProperty(KnownSceneProperty.SceneBackgroundSettings, {
        color: internalColor,
      });
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
    <React.Fragment>
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
    </React.Fragment>
  );
};
