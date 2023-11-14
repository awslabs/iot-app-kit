import React, { useCallback, useContext, useState } from 'react';
import { FormField, Input, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { KnownSceneProperty } from '../../../interfaces';
import { IPlaneGeometryComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';

export type IPlaneGeometryComponentEditorProps = IComponentEditorProps;

export const PlaneGeometryComponentEditor: React.FC<IPlaneGeometryComponentEditorProps> = ({
  node,
  component,
}: IPlaneGeometryComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const planeGeometryComponent = component as IPlaneGeometryComponentInternal;
  const intl = useIntl();

  const geometryColors = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string[]>(KnownSceneProperty.GeometryCustomColors, []),
  );
  const setGeometryColorsSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty<string[]>);

  const [internalWidth, setInternalWidth] = useState(planeGeometryComponent.width);
  const [internalHeight, setInternalHeight] = useState(planeGeometryComponent.height);
  const [internalColor, setInternalColor] = useState(planeGeometryComponent.color || '#cccccc');

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
    </SpaceBetween>
  );
};
