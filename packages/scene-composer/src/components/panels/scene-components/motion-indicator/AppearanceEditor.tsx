import React from 'react';
import { Box, FormField, Grid, Input, Select, SpaceBetween } from '@awsui/components-react';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';

import { IMotionIndicatorComponentInternal } from '../../../../store';
import { Component, Vector3 } from '../../../../models/SceneModels';

import { updateComponentForColorTypeSelection } from './helpers';
import ColorEditor from './ColorEditor';
import PreviewArrow from './PreviewArrow';

interface IAppearanceEditorProps {
  component: IMotionIndicatorComponentInternal;
  scale: Vector3;
  onUpdateCallback: (componentPartial: any, replace?: boolean | undefined) => void;
}

const AppearanceEditor: React.FC<IAppearanceEditorProps> = ({ component, scale, onUpdateCallback }) => {
  const { formatMessage } = useIntl();
  const selectedColorType = component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]
    ? Component.MotionIndicatorDataBindingName.ForegroundColor
    : Component.MotionIndicatorDataBindingName.BackgroundColor;
  const selectedForegroundColor = selectedColorType === Component.MotionIndicatorDataBindingName.ForegroundColor;

  const options = [
    {
      label: formatMessage({
        defaultMessage: 'Arrow with background',
        description: 'option text of a Select component',
      }),
      value: Component.MotionIndicatorDataBindingName.BackgroundColor,
    },
    {
      label: formatMessage({ defaultMessage: 'Arrow color', description: 'option text of a Select component' }),
      value: Component.MotionIndicatorDataBindingName.ForegroundColor,
    },
  ];

  return (
    <FormField label={formatMessage({ defaultMessage: 'Indicator appearance', description: 'Form Field label' })}>
      <SpaceBetween size='s'>
        <Grid gridDefinition={[{ colspan: 10 }, { colspan: 2 }]}>
          <Select
            data-testid={'motion-indicator-color-type-select'}
            selectedOption={options.find((elem) => elem.value === selectedColorType) || options[0]}
            onChange={(e) => {
              const value = e.detail.selectedOption.value;
              if (value && value !== selectedColorType) {
                const updatedComponent = updateComponentForColorTypeSelection(value, component);
                onUpdateCallback(updatedComponent, true);
              }
            }}
            options={options}
            selectedAriaLabel={formatMessage({
              defaultMessage: 'Selected',
              description:
                'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
            })}
            placeholder={formatMessage({ defaultMessage: 'Choose a color', description: 'placeholder' })}
          />
          {isEmpty(component.valueDataBindings[selectedColorType]) && (
            <PreviewArrow
              opacity={selectedForegroundColor ? 1 : component.config.backgroundColorOpacity}
              background={component.config.defaultBackgroundColor as string}
              color={selectedForegroundColor ? (component.config.defaultForegroundColor as string) : undefined}
            />
          )}
        </Grid>
        <FormField label={formatMessage({ defaultMessage: 'Arrow', description: 'Form Field label' })}>
          <Box display='inline'>
            {formatMessage({
              defaultMessage: '# of arrows',
              description: 'label for an input component selecting number of arrows',
            })}
            <div style={{ width: '37px', display: 'inline-block', marginLeft: '13px' }}>
              <Input
                data-testid={'motion-indicator-arrow-number-input'}
                inputMode='numeric'
                onChange={({ detail }) => {
                  const updatedComponent = {
                    ...component,
                    config: {
                      ...component.config,
                      numOfRepeatInY: Number(detail.value),
                    },
                  };
                  onUpdateCallback(updatedComponent, true);
                }}
                value={String(component.config.numOfRepeatInY)}
              />
            </div>
          </Box>
        </FormField>
        <ColorEditor component={component} selectedColorType={selectedColorType} onUpdateCallback={onUpdateCallback} />
      </SpaceBetween>
    </FormField>
  );
};

AppearanceEditor.displayName = 'AppearanceEditor';

export default AppearanceEditor;
