import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { Grid, Select } from '@awsui/components-react';

import { COMPOSER_FEATURES, SceneResourceType } from '../../../interfaces';
import {
  convertToIotTwinMakerNamespace,
  getSceneResourceDefaultValue,
  getSceneResourceInfo,
} from '../../../utils/sceneResourceUtils';
import useFeature from '../../../hooks/useFeature';

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
  const targetInfo = getSceneResourceInfo(target);
  const { formatMessage } = useIntl();

  const [{ variation: opacityRuleEnabled }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.OpacityRule]);

  const options = Object.values(SceneResourceType)
    .filter((type) => {
      return opacityRuleEnabled === 'C' ? type !== SceneResourceType.Opacity : true;
    })
    .map((type) => ({
      label: formatMessage(i18nSceneResourceTypeStrings[SceneResourceType[type]]) || SceneResourceType[type],
      value: SceneResourceType[type],
    }));
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
        <SceneRuleTargetIconEditor
          targetValue={targetInfo.value}
          onChange={(targetValue) => onChange(convertToIotTwinMakerNamespace(targetInfo.type, targetValue))}
        />
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
