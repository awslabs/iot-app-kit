import React, { useCallback } from 'react';
import { Box, Button, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { IValueDataBinding, IValueDataBindingProvider } from '../../../../interfaces';
import { generateUUID } from '../../../../utils/mathUtils';
import { Divider } from '../../../Divider';
import { Component } from '../../../../models/SceneModels';
import { ISceneComponentInternal } from '../../../../store';
import { DataBindingMapNameEditor } from '../data-overlay/DataBindingMapNameEditor';

import { ValueDataBindingBuilder } from './ValueDataBindingBuilder';

export interface ComponentWithDataBindings extends ISceneComponentInternal {
  valueDataBindings: Component.IDataBindingMap[] | Component.ValueDataBindingNamedMap[];
}

interface IDataBindingMapEditorProps {
  hasBindingName: boolean;
  valueDataBindingProvider: IValueDataBindingProvider | undefined;
  component: ComponentWithDataBindings;
  onUpdateCallback: (componentPartial: Partial<ComponentWithDataBindings>, replace?: boolean | undefined) => void;

  skipFirstDivider?: boolean;
  allowPartialBinding?: boolean;
}

const RemoveButtonContainer = styled.div`
  float: right;
  height: 12px;
`;
const Spacing = styled.div`
  height: 8px;
`;

export const DataBindingMapEditor: React.FC<IDataBindingMapEditorProps> = ({
  hasBindingName,
  valueDataBindingProvider,
  component,
  onUpdateCallback,
  skipFirstDivider,
  allowPartialBinding,
}) => {
  const intl = useIntl();

  const onBindingChange = useCallback(
    (valueDataBinding: IValueDataBinding, index) => {
      // we don't want to merge the dataBindingContext, so we'll need to manually replace it
      const updatedComponent = {
        ...component,
        valueDataBindings: [...component.valueDataBindings],
      };
      updatedComponent.valueDataBindings[index] = {
        ...updatedComponent.valueDataBindings[index],
        valueDataBinding,
      };
      onUpdateCallback(updatedComponent, true);
    },
    [component.valueDataBindings, onUpdateCallback],
  );

  const onRemoveBinding = useCallback(
    (index) => {
      const newBindings = component.valueDataBindings.filter((_, i) => i !== index);
      onUpdateCallback({ ...component, valueDataBindings: newBindings }, true);
    },
    [component.valueDataBindings, onUpdateCallback],
  );

  const onAddBinding = useCallback(() => {
    const newBindings = [...component.valueDataBindings];
    newBindings.push(hasBindingName ? { bindingName: generateUUID() } : {});
    onUpdateCallback({ valueDataBindings: newBindings });
  }, [component.valueDataBindings, onUpdateCallback]);

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <>
          {!isEmpty(component.valueDataBindings) &&
            component.valueDataBindings.map((binding, index) => (
              <Box key={index}>
                {(index > 0 || !skipFirstDivider) && <Divider />}

                <RemoveButtonContainer>
                  <Button
                    data-testid='remove-binding-button'
                    iconName='close'
                    variant='icon'
                    iconAlign='right'
                    onClick={() => onRemoveBinding(index)}
                  />
                </RemoveButtonContainer>
                <Spacing />

                {hasBindingName && (
                  <DataBindingMapNameEditor
                    bindingName={(binding as Component.ValueDataBindingNamedMap).bindingName}
                    index={index}
                    valueDataBindings={component.valueDataBindings as Component.ValueDataBindingNamedMap[]}
                    onUpdateCallback={onUpdateCallback}
                  />
                )}

                <Box margin={{ vertical: 's' }}>
                  <ValueDataBindingBuilder
                    allowPartialBinding={allowPartialBinding}
                    componentRef={component.ref}
                    binding={binding.valueDataBinding}
                    valueDataBindingProvider={valueDataBindingProvider}
                    onChange={(v) => onBindingChange(v, index)}
                  />
                </Box>
              </Box>
            ))}
          <Button data-testid='add-binding-button' onClick={onAddBinding}>
            {intl.formatMessage({ defaultMessage: 'Add data binding', description: 'Button text' })}
          </Button>
        </>
      )}
    </SpaceBetween>
  );
};
