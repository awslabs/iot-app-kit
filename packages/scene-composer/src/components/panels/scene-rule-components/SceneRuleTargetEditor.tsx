import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { Grid, Select } from '@awsui/components-react';

import { SceneResourceType } from '../../../interfaces';
import {
  convertToIotTwinMakerNamespace,
  getSceneResourceDefaultValue,
  getSceneResourceInfo,
} from '../../../utils/sceneResourceUtils';

import { SceneRuleTargetColorEditor } from './SceneRuleTargetColorEditor';
import { SceneRuleTargetIconEditor } from './SceneRuleTargetIconEditor';

interface ISceneRuleTargetEditorProps {
  target: string;
  onChange: (target: string) => void;
}

export const SceneRuleTargetEditor: React.FC<ISceneRuleTargetEditorProps> = ({
  target,
  onChange,
}: ISceneRuleTargetEditorProps) => {
  const targetInfo = getSceneResourceInfo(target);
  const intl = useIntl();

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
  });

  const options = Object.values(SceneResourceType).map((type) => ({
    label: intl.formatMessage(i18nSceneResourceTypeStrings[SceneResourceType[type]]) || SceneResourceType[type],
    value: SceneResourceType[type],
  }));
  return (
    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
      <Select
        selectedOption={{
          label: intl.formatMessage(i18nSceneResourceTypeStrings[targetInfo.type]) || targetInfo.type,
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
        selectedAriaLabel={intl.formatMessage({
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
    </Grid>
  );
};
