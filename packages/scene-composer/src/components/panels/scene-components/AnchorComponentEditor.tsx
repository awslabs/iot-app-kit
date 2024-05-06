import {
  AttributeEditor,
  FormField,
  Grid,
  Input,
  Select,
  SpaceBetween,
  TextContent,
} from '@cloudscape-design/components';
import { IconLookup, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SCENE_ICONS } from '../../../common/constants';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { DefaultAnchorStatus, IValueDataBinding, KnownSceneProperty, SceneResourceType } from '../../../interfaces';
import { IAnchorComponentInternal, ISceneComponentInternal, useSceneDocument, accessStore } from '../../../store';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';
import { shallowEqualsArray } from '../../../utils/objectUtils';
import { i18nSceneIconsKeysStrings } from '../../../utils/polarisUtils';
import { convertToIotTwinMakerNamespace, getSceneResourceInfo } from '../../../utils/sceneResourceUtils';
import { colors } from '../../../utils/styleUtils';
import { TextInput } from '../CommonPanelComponents';
import { IComponentEditorProps } from '../ComponentEditor';

import { ValueDataBindingBuilder } from './common/ValueDataBindingBuilder';
import { ColorSelectorCombo } from './tag-style/ColorSelectorCombo/ColorSelectorCombo';
import { DecodeSvgString } from './tag-style/ColorSelectorCombo/ColorSelectorComboUtils/DecodeSvgString';
import { IconPicker } from './tag-style/IconPicker/IconPicker';

export const convertParamsToKeyValuePairs = (params: Record<string, string>) => {
  return Object.keys(params).map((key) => {
    return { key, value: params[key] };
  });
};

const i18nIconStrings = defineMessages({
  [DefaultAnchorStatus.Info]: { defaultMessage: 'Info icon', description: 'Icon name label' },
  [DefaultAnchorStatus.Warning]: { defaultMessage: 'Warning icon', description: 'Icon name label' },
  [DefaultAnchorStatus.Error]: { defaultMessage: 'Error icon', description: 'Icon name label' },
  [DefaultAnchorStatus.Video]: { defaultMessage: 'Video icon', description: 'Icon name label' },
  [DefaultAnchorStatus.Custom]: { defaultMessage: 'Custom icon', description: 'Icon name label' },
});

export type IAnchorComponentEditorProps = IComponentEditorProps;

// TODO: This component is very poorly written, has too many responsibilities, and is using questionable hacks (like updating state on useEffect, and deouncing it to prevent a rerender cycle loop)
export const AnchorComponentEditor: React.FC<IAnchorComponentEditorProps> = ({
  node,
  component,
}: IAnchorComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  const valueDataBindingProvider = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const anchorComponent = component as IAnchorComponentInternal;
  const [items, setItems] = useState<{ key: string; value: string; constraintText?: string }[]>([]);
  const hasDuplicateKeyRef = useRef<boolean>(false);
  const { document, listSceneRuleMapIds, getSceneProperty, getSceneRuleMapById } = useSceneDocument(sceneComposerId);
  const tagStyleColors = getSceneProperty<string[]>(KnownSceneProperty.TagCustomColors, []);
  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);

  const intl = useIntl();

  const isDynamic = isDynamicScene(document);

  const ruleMapIds = listSceneRuleMapIds();
  const filteredList: string[] = useMemo(
    () =>
      ruleMapIds.filter((id) =>
        getSceneRuleMapById(id)?.statements.some(
          (sm) => getSceneResourceInfo(sm.target).type === SceneResourceType.Icon,
        ),
      ),
    [ruleMapIds],
  );

  const selectedRuleMapId =
    anchorComponent.ruleBasedMapId && ruleMapIds.includes(anchorComponent.ruleBasedMapId)
      ? anchorComponent.ruleBasedMapId
      : null;

  const onUpdateCallbackDebounced = useCallback(
    debounce(
      (componentPartial: any, replace?: boolean) => {
        const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
        updateComponentInternal(node.ref, componentPartialWithRef, replace);
      },
      isDynamic ? 1000 : 100,
    ), // TODO: Temporary solution for the error when updating entity too frequent. Will implement a better solution for GA.
    [node.ref, component.ref],
  );

  const onUpdateCallbackForChosenColor = useCallback(
    debounce((componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    }, 300),
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

  const iconOptions = Object.keys(SCENE_ICONS).map((sceneIcon) => {
    return {
      label: intl.formatMessage(i18nSceneIconsKeysStrings[sceneIcon]) || sceneIcon,
      value: sceneIcon,
    };
  });

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

  const ruleOptions = filteredList
    .concat(
      selectedRuleMapId
        ? intl.formatMessage({
            defaultMessage: 'No Rule',
            description: 'signify No rule option to be selected in a drop down menu',
          })
        : [],
    )
    .map((ruleMapId) => {
      return { label: ruleMapId, value: ruleMapId };
    });

  const hasIcon = iconSelectedOptionIndex >= 0;
  const iconGridDefinition = hasIcon ? [{ colspan: 10 }, { colspan: 2 }] : [{ colspan: 12 }];
  const isCustomStyle = iconOptions[iconSelectedOptionIndex]?.value === 'Custom';
  const customIcon = (anchorComponent.customIcon ?? { prefix: '', iconName: '' }) as IconLookup;
  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Tag style', description: 'Form field label' })}>
        <Grid gridDefinition={iconGridDefinition}>
          <Select
            data-testid='anchor-default-icon-select'
            selectedOption={hasIcon ? iconOptions[iconSelectedOptionIndex] : null}
            onChange={(e) => {
              if (e.detail.selectedOption.value) {
                const icon = convertToIotTwinMakerNamespace(SceneResourceType.Icon, e.detail.selectedOption.value);
                onUpdateCallback({
                  icon,
                });
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
          {hasIcon &&
            (isCustomStyle ? (
              <DecodeSvgString
                selectedColor={anchorComponent.chosenColor ?? colors.infoBlue}
                iconString={iconString!}
                customIcon={customIcon && findIconDefinition(customIcon)}
                width='32px'
                height='32px'
                ariaLabel={intl.formatMessage(i18nIconStrings[iconOptions[iconSelectedOptionIndex]?.value])}
              />
            ) : (
              <img
                aria-label={intl.formatMessage(i18nIconStrings[iconOptions[iconSelectedOptionIndex]?.value])}
                width='32px'
                height='32px'
                src={`data:image/svg+xml;base64,${iconString}`}
              />
            ))}
        </Grid>
      </FormField>
      {isCustomStyle && (
        <FormField>
          <SpaceBetween size='m'>
            <ColorSelectorCombo
              color={anchorComponent.chosenColor ?? colors.customBlue}
              onSelectColor={(pickedColor) => {
                onUpdateCallbackForChosenColor({
                  chosenColor: pickedColor,
                });
              }}
              onUpdateCustomColors={(chosenCustomColors) =>
                setSceneProperty(KnownSceneProperty.TagCustomColors, chosenCustomColors)
              }
              customColors={tagStyleColors}
              colorPickerLabel={intl.formatMessage({ defaultMessage: 'Color', description: 'Color' })}
              customColorLabel={intl.formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
            />
            <IconPicker
              onSelectIconChange={(pickedIcon) => {
                onUpdateCallback({
                  customIcon: pickedIcon,
                });
              }}
              selectedIcon={customIcon}
              iconPickerLabel={intl.formatMessage({ defaultMessage: 'Icon', description: 'Icon' })}
              iconFilterText={intl.formatMessage({ defaultMessage: 'Find icons', description: 'Find icons' })}
              iconFilterTextAriaLabel={intl.formatMessage({
                defaultMessage: 'Filter icons',
                description: 'Filter icons',
              })}
              iconButtonText={intl.formatMessage({ defaultMessage: 'Select an icon', description: 'Select an icon' })}
            />
          </SpaceBetween>
        </FormField>
      )}

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
          data-testid='anchor-rule-id-select'
          selectedOption={selectedRuleMapId ? { label: selectedRuleMapId, value: selectedRuleMapId } : null}
          onChange={(e) => {
            const ruleMapId = e.detail.selectedOption.value;
            if (ruleMapId) {
              if (ruleMapIds.includes(ruleMapId)) {
                onUpdateCallbackDebounced({ ruleBasedMapId: ruleMapId });
              } else {
                onUpdateCallbackDebounced({ ruleBasedMapId: undefined });
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
        <TextInput
          data-testid='anchor-link-target-input'
          value={anchorComponent.navLink?.destination || ''}
          setValue={(e) => onUpdateCallback({ navLink: { destination: e } })}
        />
      </FormField>

      <TextContent>
        {intl.formatMessage({ defaultMessage: 'Link Parameters', description: 'Form section title' })}
      </TextContent>
      <AttributeEditor
        data-testid='anchor-attribute-editor-select'
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
