import React, { useEffect, useState } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { Grid, Select } from '@awsui/components-react';

import { COMPOSER_FEATURES, SceneResourceType } from '../../../interfaces';
import {
  convertToIotTwinMakerNamespace,
  getSceneResourceDefaultValue,
  getSceneResourceInfo,
} from '../../../utils/sceneResourceUtils';
import useFeature from '../../../hooks/useFeature';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { ColorPicker } from '../scene-components/tag-style/ColorPicker/ColorPicker';
import { colors } from '../../../utils/styleUtils';

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
  onChange: (target: string) => void;
}

export const SceneRuleTargetEditor: React.FC<ISceneRuleTargetEditorProps> = ({
  target,
  onChange,
}: ISceneRuleTargetEditorProps) => {
  const getCustomColor: string = target.includes('Custom-') ? target.split('-')[1] : colors.customBlue;
  const targetInfo = getSceneResourceInfo(target);
  const { formatMessage } = useIntl();

  const [{ variation: opacityRuleEnabled }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.OpacityRule]);
  const tagStyle = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagStyle];
  const [chosenColor, setChosenColor] = useState<string>(getCustomColor);
  const options = Object.values(SceneResourceType)
    .filter((type) => {
      return opacityRuleEnabled === 'C' ? type !== SceneResourceType.Opacity : true;
    })
    .map((type) => ({
      label: formatMessage(i18nSceneResourceTypeStrings[SceneResourceType[type]]) || SceneResourceType[type],
      value: SceneResourceType[type],
    }));
  const isCustomStyle = tagStyle && targetInfo.value === 'Custom';

  useEffect(() => {
    setChosenColor(getCustomColor);
  }, [getCustomColor]);

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
              const colorWithIcon = targetValue === 'Custom' ? `${targetValue}-${chosenColor}` : targetValue;
              onChange(convertToIotTwinMakerNamespace(targetInfo.type, colorWithIcon));
            }}
            chosenColor={chosenColor}
          />
          {isCustomStyle && (
            <ColorPicker
              color={chosenColor}
              onSelectColor={(newColor) => {
                const colorWithIcon =
                  targetInfo.value === 'Custom' ? `${targetInfo.value}-${newColor}` : targetInfo.value;
                onChange(convertToIotTwinMakerNamespace(targetInfo.type, colorWithIcon));
                setChosenColor(newColor);
              }}
              colorPickerLabel={formatMessage({ defaultMessage: 'Colors', description: 'Colors' })}
              customColorLabel={formatMessage({ defaultMessage: 'Custom colors', description: 'Custom colors' })}
            />
          )}
        </>
      )}
      {targetInfo.type === SceneResourceType.Color && (
        <SceneRuleTargetColorEditor
          targetValue={targetInfo.value}
          onChange={(targetValue) => onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue))}
        />
      )}
      {opacityRuleEnabled === 'T1' && targetInfo.type === SceneResourceType.Opacity && (
        <SceneRuleTargetOpacityEditor
          targetValue={targetInfo.value}
          onChange={(targetValue) => onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue))}
        />
      )}
    </Grid>
  );
};
