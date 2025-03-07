import { Button, FormField, Input, SpaceBetween } from '@cloudscape-design/components';
import { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, KnownSceneProperty, TextureFileTypeList } from '../../../interfaces';
import { type IPlaneGeometryComponentInternal, type ISceneComponentInternal, accessStore } from '../../../store';
import { parseS3BucketFromArn } from '../../../utils/pathUtils';
import { type IComponentEditorProps } from '../ComponentEditor';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';

export type IPlaneGeometryComponentEditorProps = IComponentEditorProps;

export const PlaneGeometryComponentEditor: React.FC<IPlaneGeometryComponentEditorProps> = ({
  node,
  component,
}: IPlaneGeometryComponentEditorProps) => {
  const texturesEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Textures];
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  const planeGeometryComponent = component as IPlaneGeometryComponentInternal;
  const intl = useIntl();

  const geometryColors = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.GeometryCustomColors, []),
  );
  const setGeometryColorsSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);
  const showAssetBrowserCallback = accessStore(sceneComposerId)(
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
