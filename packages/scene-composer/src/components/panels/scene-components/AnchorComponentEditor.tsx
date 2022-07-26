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

import { ValueDataBindingBuilder } from './ValueDataBindingBuilder';

export const convertParamsToKeyValuePairs = (params: Record<string, string>) => {
  return Object.keys(params).map((key) => {
    return { key, value: params[key] };
  });
};

export interface IAnchorComponentEditorProps extends IComponentEditorProps {}

export const AnchorComponentEditor: React.FC<IAnchorComponentEditorProps> = ({
  node,
  component,
}: IAnchorComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const anchorComponent = component as IAnchorComponentInternal;
  const [items, setItems] = useState<{ key: string; value: string; constraintText?: string }[]>([]);
  const hasDuplicateKeyRef = useRef<boolean>(false);
  const { listSceneRuleMapIds } = useSceneDocument(sceneComposerId);
  const intl = useIntl();

  const ruleMapIds = listSceneRuleMapIds();
  const selectedRuleMapId =
    anchorComponent.ruleBasedMapId && ruleMapIds.includes(anchorComponent.ruleBasedMapId)
      ? anchorComponent.ruleBasedMapId
      : null;

  const onUpdateCallbackDebounced = useCallback(
    debounce((componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    }, 100),
    [node.ref, component.ref],
  );

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  useMemo(() => {
    setItems(convertParamsToKeyValuePairs(anchorComponent.navLink?.params || {}));
  }, [anchorComponent]);

  useEffect(() => {
    // update the state if the items are changed
    const params = convertParamsToKeyValuePairs(anchorComponent.navLink?.params || {});
    if (!shallowEqualsArray(items, params)) {
      const updatedComponent = { ...anchorComponent } as IAnchorComponentInternal;
      updatedComponent.navLink = Object.assign({}, updatedComponent.navLink);
      if (!hasDuplicateKeyRef.current) {
        updatedComponent.navLink.params = Object.assign({}, Object.fromEntries(items.map((i) => [i.key, i.value])));
        onUpdateCallbackDebounced(updatedComponent, true);
      }
    }
  }, [items]);

  const updateItem = (itemIndex: number, newKey: string, newValue: string) => {
    const updatedItems = [...items];
    // checking duplicate key
    const keySet = new Set<string>();
    let keyConstraintText = '';
    hasDuplicateKeyRef.current = false;
    for (const item of items) {
      if (keySet.has(newKey)) {
        keyConstraintText = 'The key already exists.';
        hasDuplicateKeyRef.current = true;
        break;
      } else {
        keySet.add(item.key);
      }
    }

    updatedItems[itemIndex] = { key: newKey, value: newValue, constraintText: keyConstraintText };
    setItems(updatedItems);
  };

  const addItem = (key: string, value: string) => {
    const updatedItems = [...items, { key, value }];
    setItems(updatedItems);
  };

  const deleteItem = (itemIndex: number) => {
    const updatedItems = [...items];
    updatedItems.splice(itemIndex, 1);
    setItems(updatedItems);
  };

  const onUpdateNavLinkParams = useCallback(
    (index, prop: 'key' | 'value', value) => {
      const newKey = prop === 'key' ? value : items[index].key;
      const newValue = prop === 'value' ? value : items[index].value;
      updateItem(index, newKey, newValue);
    },
    [items],
  );

  const iconOptions = useMemo(() => {
    return Object.keys(SCENE_ICONS).map((sceneIcon) => ({
      label: intl.formatMessage(i18nSceneIconsKeysStrings[sceneIcon]) || sceneIcon,
      value: sceneIcon,
    }));
  }, []);

  const iconSelectedOptionIndex = useMemo(() => {
    if (!anchorComponent.icon) {
      return -1;
    }

    const sceneResourceInfo = getSceneResourceInfo(anchorComponent.icon);
    return Object.keys(SCENE_ICONS).indexOf(sceneResourceInfo.value);
  }, [anchorComponent, iconOptions]);

  const iconString = useMemo(() => {
    const iconStrings = Object.values(SCENE_ICONS);
    if (iconSelectedOptionIndex < 0 || iconSelectedOptionIndex >= iconStrings.length) {
      return;
    }

    return btoa(iconStrings[iconSelectedOptionIndex]);
  }, [iconSelectedOptionIndex]);

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

  const hasIcon = iconSelectedOptionIndex >= 0;
  const iconGridDefinition = hasIcon ? [{ colspan: 10 }, { colspan: 2 }] : [{ colspan: 12 }];

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Default Icon', description: 'Form field label' })}>
        <Grid gridDefinition={iconGridDefinition}>
          <Select
            data-testid={'anchor-default-icon-select'}
            selectedOption={hasIcon ? iconOptions[iconSelectedOptionIndex] : null}
            onChange={(e) => {
              if (e.detail.selectedOption.value) {
                const icon = convertToIotTwinMakerNamespace(SceneResourceType.Icon, e.detail.selectedOption.value);
                onUpdateCallback({ icon });
              }
            }}
            options={iconOptions}
            selectedAriaLabel={intl.formatMessage({
              defaultMessage: 'Selected',
              description:
                'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
            })}
            placeholder={intl.formatMessage({ defaultMessage: 'Choose an icon', description: 'placeholder' })}
          />
          {hasIcon && <img width='32px' height='32px' src={`data:image/svg+xml;base64,${iconString}`} />}
        </Grid>
      </FormField>

      {valueDataBindingProvider && (
        <ValueDataBindingBuilder
          componentRef={anchorComponent.ref}
          binding={anchorComponent.valueDataBinding}
          valueDataBindingProvider={valueDataBindingProvider}
          onChange={(valueDataBinding: IValueDataBinding) => {
            // we don't want to merge the dataBindingContext, so we'll need to manually replace it
            const updatedComponent = { ...component, valueDataBinding };
            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}

      <FormField label={intl.formatMessage({ defaultMessage: 'Rule Id', description: 'Form field label' })}>
        <Select
          data-testid={'anchor-rule-id-select'}
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

      <FormField label={intl.formatMessage({ defaultMessage: 'Link Target', description: 'Form field label' })}>
        <Input
          data-testid={'anchor-link-target-input'}
          value={anchorComponent.navLink?.destination || ''}
          onChange={(e) => onUpdateCallback({ navLink: { destination: e.detail.value } })}
        />
      </FormField>

      <TextContent>
        {intl.formatMessage({ defaultMessage: 'Link Parameters', description: 'Form section title' })}
      </TextContent>
      <AttributeEditor
        data-testid={'anchor-attribute-editor-select'}
        items={items}
        isItemRemovable={() => true}
        definition={[
          {
            label: intl.formatMessage({ defaultMessage: 'Key', description: 'Field label' }),
            control: (item, index) => (
              <Input
                value={item.key}
                placeholder={intl.formatMessage({ defaultMessage: 'Key', description: 'placeholder' })}
                onChange={({ detail }) => {
                  onUpdateNavLinkParams(index, 'key', detail.value);
                }}
              />
            ),
            constraintText: (item) => item.constraintText,
          },
          {
            label: intl.formatMessage({ defaultMessage: 'Value', description: 'Field label' }),
            control: (item, index) => (
              <Input
                value={item.value}
                placeholder={intl.formatMessage({ defaultMessage: 'Value', description: 'placeholder' })}
                onChange={({ detail }) => {
                  onUpdateNavLinkParams(index, 'value', detail.value);
                }}
              />
            ),
          },
        ]}
        addButtonText={intl.formatMessage({
          defaultMessage: 'Add parameter',
          description: 'Add parameter Button Text',
        })}
        removeButtonText={intl.formatMessage({
          defaultMessage: 'Remove parameter',
          description: 'Remove parameter Button Text',
        })}
        empty={intl.formatMessage({
          defaultMessage: 'No parameter',
          description: 'visual text to show there are no parameters',
        })}
        onAddButtonClick={() => addItem('', '')}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          deleteItem(itemIndex);
        }}
      />
    </SpaceBetween>
  );
};
