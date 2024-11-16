import { Button, FormField, Select, SpaceBetween } from '@cloudscape-design/components';
import { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { type IValueDataBinding } from '../../../interfaces';
import { type IColorOverlayComponentInternal, type ISceneComponentInternal, accessStore } from '../../../store';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';
import { type IComponentEditorProps } from '../ComponentEditor';

import { ValueDataBindingBuilder } from './common/ValueDataBindingBuilder';

export type IColorOverlayComponentEditor = IComponentEditorProps;

export const ColorOverlayComponentEditor: React.FC<IColorOverlayComponentEditor> = ({
  node,
  component,
}: IColorOverlayComponentEditor) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  const valueDataBindingProvider = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const listSceneRuleMapIds = accessStore(sceneComposerId)((state) => state.listSceneRuleMapIds);
  const removeComponent = accessStore(sceneComposerId)((state) => state.removeComponent);
  const intl = useIntl();
  const document = accessStore(sceneComposerId)((state) => state.document);
  const setDeleteConfirmationModalVisible = accessStore(sceneComposerId)(
    (state) => state.setDeleteConfirmationModalVisible,
  );
  const isDynamic = isDynamicScene(document);

  const colorOverlayComponent = component as IColorOverlayComponentInternal;

  const ruleMapIds = listSceneRuleMapIds();
  const selectedRuleMapId =
    colorOverlayComponent.ruleBasedMapId && ruleMapIds.includes(colorOverlayComponent.ruleBasedMapId)
      ? colorOverlayComponent.ruleBasedMapId
      : null;

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  const removeComponentCallback = useCallback(() => {
    if (isDynamic) {
      setDeleteConfirmationModalVisible(true, {
        type: 'deleteComponent',
        nodeRef: node.ref,
        componentRef: component.ref,
      });
    } else {
      removeComponent(node.ref, component.ref);
    }
  }, [node, component]);

  const ruleOptions = ruleMapIds
    .concat(
      selectedRuleMapId
        ? intl.formatMessage({
            defaultMessage: 'No Rule',
            description: 'signify No rule option to be selected in a drop down menu',
          })
        : [],
    )
    .map((ruleMapId) => ({ label: ruleMapId, value: ruleMapId }));

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <ValueDataBindingBuilder
          componentRef={colorOverlayComponent.ref}
          binding={colorOverlayComponent.valueDataBinding}
          valueDataBindingProvider={valueDataBindingProvider}
          onChange={(valueDataBinding: IValueDataBinding) => {
            // we don't want to merge the dataBindingContext, so we'll need to manually replace it
            const updatedComponent = { ...component, valueDataBinding };
            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}

      <FormField
        label={intl.formatMessage({ defaultMessage: 'Rule Id', description: 'Form field label' })}
        data-testid='rule-id-form-field'
      >
        <Select
          selectedOption={selectedRuleMapId ? { label: selectedRuleMapId, value: selectedRuleMapId } : null}
          onChange={(e) => {
            const ruleMapId = e.detail.selectedOption.value;
            if (ruleMapId) {
              if (ruleMapIds.includes(ruleMapId)) {
                onUpdateCallback({ ruleBasedMapId: ruleMapId });
              } else {
                onUpdateCallback({ ruleBasedMapId: undefined });
              }
            }
          }}
          options={ruleOptions}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          disabled={ruleMapIds.length === 0}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose a rule', description: 'placeholder' })}
        />
      </FormField>
      <Button data-testid='color-overlay-remove-component-button' onClick={removeComponentCallback}>
        {intl.formatMessage({ defaultMessage: 'Remove', description: 'remove Button text' })}
      </Button>
    </SpaceBetween>
  );
};
