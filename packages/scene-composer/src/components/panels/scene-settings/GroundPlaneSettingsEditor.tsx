import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, FormField, Input, SpaceBetween } from '@cloudscape-design/components';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  DEFAULT_GROUND_PLANE_COLOR,
  IGroundPlaneSettings,
  KnownSceneProperty,
  COMPOSER_FEATURES,
  TextureFileTypeList,
} from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { accessStore } from '../../../store';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';
import { parseS3BucketFromArn } from '../../../utils/pathUtils';

export const GroundPlaneSettingsEditor: React.FC = () => {
  useLifecycleLogging('GroundPlaneSettingsEditor');
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = accessStore(sceneComposerId)(
    (state) => state.setSceneProperty<IGroundPlaneSettings | undefined>,
  );
  const groundSettings = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<IGroundPlaneSettings>(KnownSceneProperty.GroundPlaneSettings),
  );

  const [internalColor, setInternalColor] = useState(groundSettings?.color || DEFAULT_GROUND_PLANE_COLOR);
  const [internalUri, setInternalUri] = useState(groundSettings?.textureUri || '');
  const [internalOpacity, setInternalOpacity] = useState(groundSettings?.opacity || 0);

  const showAssetBrowserCallback = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );

  const groundColors = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.GroundCustomColors, []),
  );
  const setGroundColorsSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  const onInputBlur = useCallback(() => {
    if (groundSettings?.opacity !== internalOpacity) {
      if (groundSettings?.textureUri) {
        setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
          opacity: internalOpacity,
          textureUri: internalUri,
        });
      } else {
        setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
          opacity: internalOpacity,
          color: internalColor,
        });
      }
    }
  }, [groundSettings, internalColor, internalOpacity, internalUri]);

  const onOpacityChange = useCallback(
    (event) => {
      const value = Math.min(1, Math.max(0, Number(event.detail.value) / 100));
      if (value !== internalOpacity) {
        setInternalOpacity(value);
      }
    },
    [internalOpacity],
  );

  const onColorChange = useCallback(
    (color: string) => {
      if (color !== internalColor) {
        setInternalColor(color);
        setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
          color: color,
          opacity: internalOpacity,
        });
      }
    },
    [internalColor, internalOpacity],
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
        let newOpacity = internalOpacity;
        if (internalOpacity === 0) {
          setInternalOpacity(1);
          newOpacity = 1;
        }
        setInternalUri(localTextureUri);
        setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
          textureUri: localTextureUri,
          opacity: newOpacity,
        });
      }, TextureFileTypeList);
    } else {
      console.info('No asset browser available');
    }
  }, [internalOpacity]);

  const onTextureRemoveClick = useCallback(() => {
    setInternalUri('');
    setSceneProperty(KnownSceneProperty.GroundPlaneSettings, {
      color: internalColor,
      opacity: internalOpacity,
    });
  }, [internalColor, internalOpacity]);

  return (
    <React.Fragment>
      <FormField label={intl.formatMessage({ defaultMessage: 'Ground Plane', description: 'Form Field label' })}>
        <SpaceBetween size='s' direction='vertical'>
          {(!groundSettings?.textureUri || !texturesEnabled) && (
            <>
              <ColorSelectorCombo
                color={internalColor}
                onSelectColor={(pickedColor) => onColorChange(pickedColor)}
                onUpdateCustomColors={(chosenCustomColors) =>
                  setGroundColorsSceneProperty(KnownSceneProperty.GroundCustomColors, chosenCustomColors)
                }
                customColors={groundColors}
                colorPickerLabel={intl.formatMessage({ defaultMessage: 'Color', description: 'Color' })}
                customColorLabel={intl.formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
              />
            </>
          )}
          <FormField label={intl.formatMessage({ defaultMessage: 'Opacity %', description: 'Form Field label' })}>
            <Input
              data-testid='ground-plane-opacity-input'
              value={(internalOpacity * 100).toFixed(0)}
              type='number'
              onBlur={onInputBlur}
              onChange={onOpacityChange}
              onKeyDown={(e) => {
                if (e.detail.key === 'Enter') onInputBlur();
              }}
              step={1}
            />
          </FormField>
          {texturesEnabled && (
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
                {internalUri && <Input value={internalUri} disabled />}
              </SpaceBetween>
            </SpaceBetween>
          )}
        </SpaceBetween>
      </FormField>
    </React.Fragment>
  );
};
