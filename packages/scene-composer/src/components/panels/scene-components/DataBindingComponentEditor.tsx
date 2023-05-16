import { SpaceBetween } from '@awsui/components-react';
import React, { useCallback, useContext } from 'react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useStore } from '../../../store';
import { IDataBindingComponentInternal } from '../../../store/internalInterfaces';
import { IComponentEditorProps } from '../ComponentEditor';

import { DataBindingMapEditor } from './common/DataBindingMapEditor';
import { Component } from '../../../models/SceneModels';

export interface IDataBindingComponentEditorProps extends IComponentEditorProps {
  component: IDataBindingComponentInternal;
}

export const DataBindingComponentEditor: React.FC<IDataBindingComponentEditorProps> = ({
  node,
  component,
}: IDataBindingComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );

  const onUpdateCallback = useCallback(
    (componentPartial: Partial<IDataBindingComponentInternal>, replace?: boolean) => {
      const componentPartialWithRef = { ref: component.ref, type: component.type, ...componentPartial };
      // When the data binding component has valueDataBindings left, update the component, otherwise remove
      // the whole component instead
      if (componentPartialWithRef.valueDataBinding) {
        updateComponentInternal(node.ref, componentPartialWithRef, replace);
      } else {
        removeComponent(node.ref, component.ref);
      }
    },
    [node.ref, component.ref],
  );

  return (
    <SpaceBetween size='s'>
      <DataBindingMapEditor
        allowPartialBinding
        skipFirstDivider
        hasBindingName={false}
        numFields={1}
        hasRemoveButton={false}
        valueDataBindingProvider={valueDataBindingProvider}
        component={{ ...component, valueDataBindings: [component.valueDataBinding as Component.IDataBindingMap] }}
        onUpdateCallback={onUpdateCallback}
      />
    </SpaceBetween>
  );
};
