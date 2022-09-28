import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Grid, Select } from '@awsui/components-react';

import { SCENE_ICONS } from '../../../common/constants';
import { DefaultAnchorStatus } from '../../../interfaces';
import { i18nSceneIconsKeysStrings } from '../../../utils/polarisUtils';

interface ISceneRuleTargetIconEditorProps {
  targetValue: string;
  onChange: (target: string) => void;
}

export const SceneRuleTargetIconEditor: React.FC<ISceneRuleTargetIconEditorProps> = ({
  targetValue,
  onChange,
}: ISceneRuleTargetIconEditorProps) => {
  const propsSelectedIcon = DefaultAnchorStatus[targetValue] ?? DefaultAnchorStatus.Info;
  const [selectedIcon, setSelectedIcon] = useState<DefaultAnchorStatus>(propsSelectedIcon);
  const intl = useIntl();

  const options = Object.keys(SCENE_ICONS).map((sceneIcon) => ({
    label: intl.formatMessage(i18nSceneIconsKeysStrings[sceneIcon]) || sceneIcon,
    value: sceneIcon,
  }));

  const iconString = useMemo(() => {
    return btoa(SCENE_ICONS[selectedIcon]);
  }, [selectedIcon]);

  return (
    <Grid gridDefinition={[{ colspan: 9 }, { colspan: 2 }]}>
      <Select
        selectedOption={{
          label: intl.formatMessage(i18nSceneIconsKeysStrings[selectedIcon]) || selectedIcon,
          value: selectedIcon,
        }}
        onChange={(e) => {
          const value = e.detail.selectedOption.value;
          if (value) {
            const newSelectedIcon = DefaultAnchorStatus[value];
            setSelectedIcon(DefaultAnchorStatus[value]);
            onChange(newSelectedIcon);
          }
        }}
        options={options}
        selectedAriaLabel={intl.formatMessage({
          defaultMessage: 'Selected',
          description:
            'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
        })}
      />
      <img width='32px' height='32px' src={`data:image/svg+xml;base64,${iconString}`} />
    </Grid>
  );
};
