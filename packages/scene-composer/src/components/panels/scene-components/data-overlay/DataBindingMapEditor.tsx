import React, { useCallback } from 'react';
import { Box, Button, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { IValueDataBinding, IValueDataBindingProvider } from '../../../../interfaces';
import { IDataOverlayComponentInternal } from '../../../../store';
import { ValueDataBindingBuilder } from '../ValueDataBindingBuilder';
import { generateUUID } from '../../../../utils/mathUtils';
import { Divider } from '../../../Divider';

import { DataBindingMapNameEditor } from './DataBindingMapNameEditor';

interface IDataBindingMapEditorProps {
  valueDataBindingProvider: IValueDataBindingProvider | undefined;
  component: IDataOverlayComponentInternal;
  onUpdateCallback: (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean | undefined) => void;
}

const RemoveButtonContainer = styled.div`
  float: right;
  height: 12px;
`;
const Spacing = styled.div`
  height: 8px;
`;

export const DataBindingMapEditor: React.FC<IDataBindingMapEditorProps> = ({
  valueDataBindingProvider,
  component,
  onUpdateCallback,
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
    newBindings.push({ bindingName: generateUUID() });
    onUpdateCallback({ valueDataBindings: newBindings });
  }, [component.valueDataBindings, onUpdateCallback]);

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <>
          {!isEmpty(component.valueDataBindings) &&
            component.valueDataBindings.map(({ bindingName, valueDataBinding }, index) => (
              <Box key={index}>
                <Divider />

                <RemoveButtonContainer>
                  <Button
                    data-test-id='remove-binding-button'
                    iconName='close'
                    variant='icon'
                    iconAlign='right'
                    onClick={() => onRemoveBinding(index)}
                  />
                </RemoveButtonContainer>
                <Spacing />

                <DataBindingMapNameEditor
                  bindingName={bindingName}
                  index={index}
                  valueDataBindings={component.valueDataBindings}
                  onUpdateCallback={onUpdateCallback}
                />

                <Box margin={{ vertical: 's' }}>
                  <ValueDataBindingBuilder
                    componentRef={component.ref}
                    binding={valueDataBinding}
                    valueDataBindingProvider={valueDataBindingProvider}
                    onChange={(v) => onBindingChange(v, index)}
                  />
                </Box>
              </Box>
            ))}
          <Button data-test-id='add-binding-button' onClick={onAddBinding}>
            {intl.formatMessage({ defaultMessage: 'Add data binding', description: 'Button text' })}
          </Button>
        </>
      )}
    </SpaceBetween>
  );
};
