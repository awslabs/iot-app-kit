import React, { useCallback, useContext, useState } from 'react';
import { Button, FormField, Input, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownSceneProperty, TextureFileTypeList } from '../../../interfaces';
import { IPlaneGeometryComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';
import { parseS3BucketFromArn } from '../../../utils/pathUtils';

export type IPlaneGeometryComponentEditorProps = IComponentEditorProps;

export const PlaneGeometryComponentEditor: React.FC<IPlaneGeometryComponentEditorProps> = ({
  node,
  component,
}: IPlaneGeometryComponentEditorProps) => {
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const planeGeometryComponent = component as IPlaneGeometryComponentInternal;
  const intl = useIntl();

  const geometryColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.GeometryCustomColors, []),
  );
  const setGeometryColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);
  const showAssetBrowserCallback = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );

  const [internalWidth, setInternalWidth] = useState(planeGeometryComponent.width);
  const [internalHeight, setInternalHeight] = useState(planeGeometryComponent.height);
  const [internalColor, setInternalColor] = useState(planeGeometryComponent.color || '#cccccc');
  const [internalUri, setInternalUri] = useState(planeGeometryComponent.textureUri || '');

  const onUpdateCallback = useCallback(
    (componentPartial: IPlaneGeometryComponentInternal, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ...componentPartial, ref: component.ref };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  const onColorChange = useCallback(
    (color: string) => {
      if (color !== internalColor) {
        setInternalColor(color);
        const updatedComponent = { ...planeGeometryComponent, color };
        onUpdateCallback(updatedComponent, true);
      }
    },
    [internalColor, planeGeometryComponent],
  );

  const onInputBlur = useCallback(() => {
    const updatedComponent = { ...planeGeometryComponent, width: internalWidth, height: internalHeight };
    onUpdateCallback(updatedComponent, true);
  }, [planeGeometryComponent, internalWidth, internalHeight]);

  const onWidthChange = useCallback(
    (event) => {
      const value = Number(event.detail.value);
      if (value !== internalWidth) {
        setInternalWidth(value);
      }
    },
    [internalWidth],
  );

  const onHeightChange = useCallback(
    (event) => {
      const value = Number(event.detail.value);
      if (value !== internalHeight) {
        setInternalHeight(value);
      }
    },
    [internalHeight],
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
        const { color: _color, ...otherComponentProps } = planeGeometryComponent;
        const updatedComponent = { ...otherComponentProps, textureUri: localTextureUri };
        onUpdateCallback(updatedComponent, true);
      }, TextureFileTypeList);
    } else {
      console.info('No asset browser available');
    }
  }, [planeGeometryComponent]);

  const onTextureRemoveClick = useCallback(() => {
    setInternalUri('');
    const { textureUri: _textureUri, ...otherComponentProps } = planeGeometryComponent;
    const updatedComponent = { ...otherComponentProps, color: internalColor };
    onUpdateCallback(updatedComponent, true);
  }, [planeGeometryComponent, internalColor]);

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Width', description: 'Form Field label' })}>
        <Input
          data-testid='plane-width-input'
          value={String(internalWidth)}
          type='number'
          onBlur={onInputBlur}
          onChange={onWidthChange}
          onKeyDown={(e) => {
            if (e.detail.key === 'Enter') onInputBlur();
          }}
        />
      </FormField>
      <FormField label={intl.formatMessage({ defaultMessage: 'Height', description: 'Form Field label' })}>
        <Input
          data-testid='plane-height-input'
          value={String(internalHeight)}
          type='number'
          onBlur={onInputBlur}
          onChange={onHeightChange}
          onKeyDown={(e) => {
            if (e.detail.key === 'Enter') onInputBlur();
          }}
        />
      </FormField>
      {!planeGeometryComponent.textureUri && (
        <ColorSelectorCombo
          color={internalColor}
          onSelectColor={(pickedColor) => onColorChange(pickedColor)}
          onUpdateCustomColors={(chosenCustomColors) =>
            setGeometryColorsSceneProperty(KnownSceneProperty.GeometryCustomColors, chosenCustomColors)
          }
          customColors={geometryColors}
          colorPickerLabel={intl.formatMessage({ defaultMessage: 'Color', description: 'Color' })}
          customColorLabel={intl.formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
        />
      )}
      {texturesEnabled && (
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
  );
};
