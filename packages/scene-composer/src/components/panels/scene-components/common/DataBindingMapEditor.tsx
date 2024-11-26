import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import isEmpty from 'lodash-es/isEmpty';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type IValueDataBinding, type IValueDataBindingProvider } from '../../../../interfaces';
import { type Component } from '../../../../models/SceneModels';
import { type ISceneComponentInternal } from '../../../../store';
import { Divider } from '../../../Divider';
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
  numFields?: number;
  hasRemoveButton?: boolean;
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
  numFields,
  hasRemoveButton,
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

  const onBindingNameChange = useCallback(
    (bindingName: string, index) => {
      // we don't want to merge the dataBindingContext, so we'll need to manually replace it
      const updatedComponent = {
        ...component,
        valueDataBindings: [...component.valueDataBindings],
      };
      updatedComponent.valueDataBindings[index] = {
        ...updatedComponent.valueDataBindings[index],
        bindingName,
      };
      onUpdateCallback(updatedComponent, true);
    },
    [component, onUpdateCallback],
  );

  const onRemoveBinding = useCallback(
    (index) => {
      const newBindings = component.valueDataBindings.filter((_, i) => i !== index);
      onUpdateCallback({ ...component, valueDataBindings: newBindings }, true);
    },
    [component.valueDataBindings, onUpdateCallback],
  );

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <>
          {!isEmpty(component.valueDataBindings) &&
            component.valueDataBindings.map((binding, index) => (
              <Box key={index}>
                {(index > 0 || !skipFirstDivider) && <Divider />}

                {hasRemoveButton && (
                  <RemoveButtonContainer>
                    <Button
                      ariaLabel={intl.formatMessage({
                        defaultMessage: 'Remove data binding',
                        description: 'Button label',
                      })}
                      data-testid='remove-binding-button'
                      iconName='close'
                      variant='icon'
                      iconAlign='right'
                      onClick={() => onRemoveBinding(index)}
                    />
                  </RemoveButtonContainer>
                )}
                <Spacing />
                {hasBindingName && (
                  <DataBindingMapNameEditor
                    bindingName={(binding as Component.ValueDataBindingNamedMap).bindingName}
                    valueDataBindings={component.valueDataBindings as Component.ValueDataBindingNamedMap[]}
                    onBindingNameChange={(name) => onBindingNameChange(name, index)}
                  />
                )}

                <Box margin={{ vertical: 's' }}>
                  <ValueDataBindingBuilder
                    allowPartialBinding={allowPartialBinding}
                    componentRef={component.ref}
                    binding={binding.valueDataBinding}
                    numFields={numFields}
                    valueDataBindingProvider={valueDataBindingProvider}
                    onChange={(v) => onBindingChange(v, index)}
                  />
                </Box>
              </Box>
            ))}
        </>
      )}
    </SpaceBetween>
  );
};
