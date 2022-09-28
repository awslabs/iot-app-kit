import React, { useCallback, useContext } from 'react';
import { FormField, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IMotionIndicatorComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { Component } from '../../../models/SceneModels';
import { Divider } from '../../Divider';

import AppearanceEditor from './motion-indicator/AppearanceEditor';
import { SpeedEditor } from './motion-indicator/SpeedEditor';

export interface IMotionIndicatorComponentEditorProps extends IComponentEditorProps {}

export const MotionIndicatorComponentEditor: React.FC<IMotionIndicatorComponentEditorProps> = ({
  node,
  component,
}: IMotionIndicatorComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const motionIndicatorComponent = component as IMotionIndicatorComponentInternal;
  const selectedShape = motionIndicatorComponent.shape;
  const intl = useIntl();

  const i18nMotionIndicatorShapeStrings = defineMessages({
    LinearPlane: {
      defaultMessage: 'Linear Plane',
      description: 'Motion Indicator Shape in a dropdown menu',
    },
    LinearCylinder: {
      defaultMessage: 'Linear Cylinder',
      description: 'Motion Indicator Shape in a dropdown menu',
    },
    CircularCylinder: {
      defaultMessage: 'Circular Cylinder',
      description: 'Motion Indicator Shape in a dropdown menu',
    },
  });

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  const shapeOptions = Object.values(Component.MotionIndicatorShape).map((shape) => ({
    label: intl.formatMessage(i18nMotionIndicatorShapeStrings[shape]) || shape,
    value: shape,
  }));

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Indicator shape', description: 'FormField label' })}>
        <Select
          data-testid={'motion-indicator-shape-select'}
          selectedOption={
            selectedShape
              ? {
                  label: intl.formatMessage(i18nMotionIndicatorShapeStrings[selectedShape]) || selectedShape,
                  value: selectedShape,
                }
              : null
          }
          onChange={(e) => {
            const shape = e.detail.selectedOption.value;
            const updatedComponent = { ...motionIndicatorComponent, shape };
            onUpdateCallback(updatedComponent, true);
          }}
          options={shapeOptions}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose a shape', description: 'Placeholder' })}
        />
      </FormField>

      <Divider />

      <SpeedEditor component={motionIndicatorComponent} onUpdateCallback={onUpdateCallback} />

      <Divider />
      <AppearanceEditor
        component={motionIndicatorComponent}
        onUpdateCallback={onUpdateCallback}
        scale={node.transform.scale}
      />
    </SpaceBetween>
  );
};
