import { Grid, Select } from '@cloudscape-design/components';
import React, { useContext, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty, SceneResourceType, TargetMetadata } from '../../../interfaces';
import { IIconLookup } from '../../../models/SceneModels';
import { useSceneDocument, useStore } from '../../../store';
import {
  convertToIotTwinMakerNamespace,
  getSceneResourceDefaultValue,
  getSceneResourceInfo,
} from '../../../utils/sceneResourceUtils';
import { colors } from '../../../utils/styleUtils';
import { ColorSelectorCombo } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorCombo';
import { IconPicker } from '../scene-components/tag-style/IconPicker/IconPicker';

import { SceneRuleTargetColorEditor } from './SceneRuleTargetColorEditor';
import { SceneRuleTargetIconEditor } from './SceneRuleTargetIconEditor';
import SceneRuleTargetOpacityEditor from './SceneRuleTargetOpacityEditor';

const i18nSceneResourceTypeStrings = defineMessages({
  Icon: {
    defaultMessage: 'Icon',
    description: 'Scene Resource types in a dropdown menu',
  },
  Color: {
    defaultMessage: 'Color',
    description: 'Scene Resource types in a dropdown menu',
  },
  Number: {
    defaultMessage: 'Number',
    description: 'Scene Resource types in a dropdown menu',
  },
  Opacity: {
    defaultMessage: 'Opacity',
    description: 'Scene Resource types in a dropdown menu',
  },
});

interface ISceneRuleTargetEditorProps {
  target: string;
  onChange: (target: string, targetMetadata?: TargetMetadata) => void;
  targetMetadata?: TargetMetadata;
}

export const SceneRuleTargetEditor: React.FC<ISceneRuleTargetEditorProps> = ({
  target,
  onChange,
  targetMetadata,
}: ISceneRuleTargetEditorProps) => {
  const targetInfo = getSceneResourceInfo(target);
  const { formatMessage } = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const [chosenColor, setChosenColor] = useState<string>(targetMetadata?.color ?? colors.customBlue);
  const [icon, setIcon] = useState<IIconLookup>({
    prefix: targetMetadata?.iconPrefix as string,
    iconName: targetMetadata?.iconName as string,
  });
  const options = Object.values(SceneResourceType).map((type) => ({
    label: formatMessage(i18nSceneResourceTypeStrings[SceneResourceType[type]]) || SceneResourceType[type],
    value: SceneResourceType[type],
  }));
  const { getSceneProperty } = useSceneDocument(sceneComposerId);

  const tagStyleColors = getSceneProperty<string[]>(KnownSceneProperty.TagCustomColors, []);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);

  const isCustomStyle = targetInfo.value === 'Custom';
  return (
    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
      <Select
        selectedOption={{
          label: formatMessage(i18nSceneResourceTypeStrings[targetInfo.type]) || targetInfo.type,
          value: targetInfo.type,
        }}
        onChange={(e) => {
          if (e.detail.selectedOption.value && SceneResourceType[e.detail.selectedOption.value]) {
            const newTargetType = SceneResourceType[e.detail.selectedOption.value];
            const newTargetValue = getSceneResourceDefaultValue(newTargetType);
            onChange(convertToIotTwinMakerNamespace(newTargetType, newTargetValue));
          }
        }}
        options={options}
        selectedAriaLabel={formatMessage({
          defaultMessage: 'Selected',
          description:
            'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
        })}
      />
      {targetInfo.type === SceneResourceType.Icon && (
        <>
          <SceneRuleTargetIconEditor
            targetValue={targetInfo.value}
            onChange={(targetValue) => {
              onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue));
            }}
            chosenColor={chosenColor}
            customIcon={icon}
          />
          {isCustomStyle && (
            <>
              <ColorSelectorCombo
                color={chosenColor}
                onSelectColor={(newColor) => {
                  onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetInfo.value), {
                    ...targetMetadata,
                    color: newColor,
                  } as TargetMetadata);
                  setChosenColor(newColor);
                }}
                customColors={tagStyleColors}
                onUpdateCustomColors={(customColors) =>
                  setSceneProperty(KnownSceneProperty.TagCustomColors, customColors)
                }
                colorPickerLabel={formatMessage({ defaultMessage: 'Colors', description: 'Colors' })}
                customColorLabel={formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
              />
              <IconPicker
                onSelectIconChange={(pickedIcon) => {
                  onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetInfo.value), {
                    ...targetMetadata,
                    iconPrefix: pickedIcon.prefix,
                    iconName: pickedIcon.iconName,
                  } as TargetMetadata);
                  setIcon(pickedIcon);
                }}
                selectedIcon={icon}
                iconPickerLabel={formatMessage({ defaultMessage: 'Icon', description: 'Icon' })}
                iconFilterText={formatMessage({ defaultMessage: 'Find icons', description: 'Find icons' })}
                iconFilterTextAriaLabel={formatMessage({
                  defaultMessage: 'Filter icons',
                  description: 'Filter icons',
                })}
                iconButtonText={formatMessage({
                  defaultMessage: 'Select an icon',
                  description: 'Select an icon',
                })}
              />
            </>
          )}
        </>
      )}

      {targetInfo.type === SceneResourceType.Color && (
        <SceneRuleTargetColorEditor
          targetValue={targetInfo.value}
          onChange={(targetValue) => onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue))}
        />
      )}
      {targetInfo.type === SceneResourceType.Opacity && (
        <SceneRuleTargetOpacityEditor
          targetValue={targetInfo.value}
          onChange={(targetValue) => onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue))}
        />
      )}
    </Grid>
  );
};
