import { SpaceBetween } from '@cloudscape-design/components';
import React, { useCallback, useContext } from 'react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useStore } from '../../../store';
import { IEntityBindingComponentInternal } from '../../../store/internalInterfaces';
import { IComponentEditorProps } from '../ComponentEditor';

import { ComponentWithDataBindings, DataBindingMapEditor } from './common/DataBindingMapEditor';

export interface IEntityBindingComponentEditorProps extends IComponentEditorProps {
  component: IEntityBindingComponentInternal;
}

export const EntityBindingComponentEditor: React.FC<IEntityBindingComponentEditorProps> = ({
  node,
  component,
}: IEntityBindingComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const onUpdateCallback = useCallback(
    (componentPartial: Partial<ComponentWithDataBindings>, replace?: boolean) => {
      // When the data binding component has valueDataBindings left, update the component, otherwise remove
      // the whole component instead
      if (componentPartial.valueDataBindings && componentPartial.valueDataBindings.length > 0) {
        const valueDataBinding = componentPartial.valueDataBindings[0];
        const componentPartialWithRef = {
          ref: component.ref,
          type: component.type,
          valueDataBinding: valueDataBinding.valueDataBinding,
        };
        updateComponentInternal(node.ref, componentPartialWithRef, replace);
      } else {
        removeComponent(node.ref, component.ref);
      }
    },
    [node.ref, component.ref],
  );

  const compWithDb: ComponentWithDataBindings = {
    ref: component.ref,
    type: component.type,
    valueDataBindings: [{ valueDataBinding: component.valueDataBinding }],
  };

  return (
    <SpaceBetween size='s'>
      <DataBindingMapEditor
        allowPartialBinding
        skipFirstDivider
        hasBindingName={false}
        numFields={1}
        hasRemoveButton={false}
        valueDataBindingProvider={valueDataBindingProvider}
        component={compWithDb}
        onUpdateCallback={onUpdateCallback}
      />
    </SpaceBetween>
  );
};
