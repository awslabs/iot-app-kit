import React, { useCallback, useState, useContext, useRef } from 'react';
import { Button, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IValueDataBinding } from '../../../interfaces';
import { IDynamicLocationComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';

import { ValueDataBindingBuilder } from './ValueDataBindingBuilder';

export interface IDynamicLocationComponentEditorProps extends IComponentEditorProps {}

export const DynamicLocationComponentEditor: React.FC<IDynamicLocationComponentEditorProps> = ({
  node,
  component,
}: IDynamicLocationComponentEditorProps) => {
  console.log('loading dynamic location component editor info');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const dynamicLocationComponent = component as IDynamicLocationComponentInternal;
  const [items, setItems] = useState<{ key: string; value: string; constraintText?: string }[]>([]);
  const hasDuplicateKeyRef = useRef<boolean>(false);
  const intl = useIntl();

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  const removeComponentCallback = useCallback(() => {
    removeComponent(node.ref, component.ref);
  }, [node, component]);

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <ValueDataBindingBuilder
          componentRef={dynamicLocationComponent.ref}
          binding={dynamicLocationComponent.valueDataBinding}
          valueDataBindingProvider={valueDataBindingProvider}
          onChange={(valueDataBinding: IValueDataBinding) => {
            // we don't want to merge the dataBindingContext, so we'll need to manually replace it
            const updatedComponent = { ...component, valueDataBinding };
            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}
      <Button onClick={removeComponentCallback}>
        {intl.formatMessage({ defaultMessage: 'Remove', description: 'remove Button text' })}
      </Button>
    </SpaceBetween>
  );
};
