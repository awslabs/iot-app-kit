import React, { useCallback, useEffect, useMemo, useState, useContext, useRef } from 'react';
import { AttributeEditor, FormField, Grid, Input, Select, SpaceBetween, TextContent } from '@awsui/components-react';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { SCENE_ICONS } from '../../../common/constants';
import { IValueDataBinding, SceneResourceType } from '../../../interfaces';
import { IAnchorComponentInternal, ISceneComponentInternal, useSceneDocument, useStore } from '../../../store';
import { convertToIotTwinMakerNamespace, getSceneResourceInfo } from '../../../utils/sceneResourceUtils';
import { shallowEqualsArray } from '../../../utils/objectUtils';
import { i18nSceneIconsKeysStrings } from '../../../utils/polarisUtils';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';

export interface IControlComponentEditorProps extends IComponentEditorProps {}

export const ControlComponentEditor: React.FC<IControlComponentEditorProps> = ({
  node,
  component,
}: IControlComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const anchorComponent = component as IAnchorComponentInternal;
  const intl = useIntl();

  console.log(node, anchorComponent);

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Url', description: 'Form field label' })}>
        <Input
          value={anchorComponent.control?.url || ''}
          onChange={(e) => onUpdateCallback({ control: { url: e.detail.value } })}
        />
      </FormField>
      <FormField label={intl.formatMessage({ defaultMessage: 'Thing Name', description: 'Form field label' })}>
        <Input
          value={anchorComponent.control?.thingName || ''}
          onChange={(e) => onUpdateCallback({ control: { thingName: e.detail.value } })}
        />
      </FormField>
      <FormField label={intl.formatMessage({ defaultMessage: 'Control Name', description: 'Form field label' })}>
        <Input
          value={anchorComponent.control?.controlName || ''}
          onChange={(e) => onUpdateCallback({ control: { controlName: e.detail.value } })}
        />
      </FormField>
      <FormField label={intl.formatMessage({ defaultMessage: 'Control Type', description: 'Control Type' })}>
        <Select
          data-testid={'anchor-control-input'}
          options={[
            {
              label: 'Toggle',
              value: 'booleanToggle',
            },
            {
              label: 'Value',
              value: 'intSlider',
            },
          ]}
          selectedOption={{ value: anchorComponent.control?.controlType } || null}
          onChange={(e) => onUpdateCallback({ control: { controlType: e.detail.selectedOption.value } })}
        />
      </FormField>
      {anchorComponent.control?.controlType === 'intSlider' && (
        <>
          <FormField label={intl.formatMessage({ defaultMessage: 'Min', description: 'Form field label' })}>
            <Input
              type='number'
              value={anchorComponent.control?.sliderMin || '-100'}
              onChange={(e) => onUpdateCallback({ control: { sliderMin: e.detail.value } })}
            />
          </FormField>
          <FormField label={intl.formatMessage({ defaultMessage: 'Max', description: 'Form field label' })}>
            <Input
              type='number'
              value={anchorComponent.control?.sliderMax || '100'}
              onChange={(e) => onUpdateCallback({ control: { sliderMax: e.detail.value } })}
            />
          </FormField>
          <FormField label={intl.formatMessage({ defaultMessage: 'Step', description: 'Form field label' })}>
            <Input
              value={anchorComponent.control?.sliderStep || '10'}
              onChange={(e) => onUpdateCallback({ control: { sliderStep: e.detail.value } })}
            />
          </FormField>
        </>
      )}
    </SpaceBetween>
  );
};
