import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, FormField, Icon, Select, SpaceBetween } from '@awsui/components-react';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';

import { IMotionIndicatorComponentInternal, useStore } from '../../../../store';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component } from '../../../../models/SceneModels';

import { DataBindingEditor } from './DataBindingEditor';
import { Slider } from './Slider';

interface ISpeedEditorProps {
  component: IMotionIndicatorComponentInternal;
  onUpdateCallback: (componentPartial: any, replace?: boolean | undefined) => void;
}

export const SpeedEditor: React.FC<ISpeedEditorProps> = ({ component, onUpdateCallback }) => {
  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const [showSpeedDataBinding, setShowSpeedDataBinding] = useState(
    !isEmpty(component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]),
  );
  const [showSlider, setShowSlider] = useState(false);
  const options = [
    { label: intl.formatMessage({ defaultMessage: 'Select speed', description: 'label' }), value: 'default' },
    { label: intl.formatMessage({ defaultMessage: 'Add speed rule', description: 'label' }), value: 'binding' },
  ];

  // reset states when component changed
  useEffect(() => {
    setShowSpeedDataBinding(!isEmpty(component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]));
    setShowSlider(false);
  }, [component.ref]);

  return (
    <SpaceBetween size={'s'}>
      <FormField label={intl.formatMessage({ defaultMessage: 'Define arrow speed', description: 'FormField label' })}>
        <Select
          data-testid={'motion-indicator-speed-select'}
          selectedOption={showSpeedDataBinding ? options[1] : options[0]}
          onChange={(e) => {
            const value = e.detail.selectedOption.value;
            const useBinding = value === 'binding';
            let updatedComponent: IMotionIndicatorComponentInternal;
            if (!useBinding) {
              updatedComponent = {
                ...component,
                valueDataBindings: {
                  ...component.valueDataBindings,
                  [Component.MotionIndicatorDataBindingName.Speed]: undefined,
                },
              };
            } else {
              updatedComponent = {
                ...component,
                config: {
                  ...component.config,
                  defaultSpeed: undefined,
                },
              };
            }

            onUpdateCallback(updatedComponent, true);
            setShowSpeedDataBinding(useBinding);
          }}
          options={options}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose a speed value', description: 'Placeholder' })}
        />
      </FormField>

      {!showSpeedDataBinding && (
        <Button
          data-testid={'motion-indicator-speed-slider-button'}
          variant='normal'
          onClick={() => setShowSlider(!showSlider)}
        >
          {component.config.defaultSpeed ?? 0}
          <Box margin={{ left: 's' }} display='inline'>
            <Icon name={showSlider ? 'caret-down-filled' : 'caret-right-filled'} />
          </Box>
        </Button>
      )}

      {!showSpeedDataBinding && showSlider && (
        <Slider
          value={component.config.defaultSpeed ?? 0}
          step={0.5}
          min='0'
          max='10'
          onChange={(event) => {
            const updatedComponent = {
              ...component,
              config: { ...component.config, defaultSpeed: event.target.value },
            };
            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}

      {showSpeedDataBinding && (
        <>
          <Box fontWeight='bold' padding={{ top: 's' }}>
            {intl.formatMessage({ defaultMessage: 'Configure Rule', description: 'Box label' })}
          </Box>
          <DataBindingEditor
            valueDataBindingProvider={valueDataBindingProvider}
            component={component}
            onUpdateCallback={onUpdateCallback}
            dataBindingName={Component.MotionIndicatorDataBindingName.Speed}
          />
        </>
      )}
    </SpaceBetween>
  );
};
