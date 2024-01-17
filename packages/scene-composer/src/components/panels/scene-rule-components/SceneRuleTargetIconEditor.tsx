import { Grid, Select } from '@awsui/components-react';
import { IconLookup, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import React, { useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SCENE_ICONS } from '../../../common/constants';
import { DefaultAnchorStatus } from '../../../interfaces';
import { IIconLookup } from '../../../models/SceneModels';
import { i18nSceneIconsKeysStrings } from '../../../utils/polarisUtils';
import { colors } from '../../../utils/styleUtils';
import { DecodeSvgString } from '../scene-components/tag-style/ColorSelectorCombo/ColorSelectorComboUtils/DecodeSvgString';

interface ISceneRuleTargetIconEditorProps {
  targetValue: string;
  onChange: (target: string) => void;
  chosenColor?: string;
  customIcon?: IIconLookup;
}

export const SceneRuleTargetIconEditor: React.FC<ISceneRuleTargetIconEditorProps> = ({
  targetValue,
  onChange,
  chosenColor,
  customIcon,
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

  const isCustomStyle = targetValue === 'Custom';

  const i18nIconStrings = defineMessages({
    [DefaultAnchorStatus.Info]: { defaultMessage: 'Info icon', description: 'Icon name label' },
    [DefaultAnchorStatus.Warning]: { defaultMessage: 'Warning icon', description: 'Icon name label' },
    [DefaultAnchorStatus.Error]: { defaultMessage: 'Error icon', description: 'Icon name label' },
    [DefaultAnchorStatus.Video]: { defaultMessage: 'Video icon', description: 'Icon name label' },
    [DefaultAnchorStatus.Custom]: { defaultMessage: 'Custom icon', description: 'Icon name label' },
  });
  const iconInfo = (customIcon ?? { prefix: '', iconName: '' }) as IconLookup;
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
      {isCustomStyle ? (
        <DecodeSvgString
          selectedColor={chosenColor ?? colors.customBlue}
          iconString={iconString}
          customIcon={findIconDefinition(iconInfo)}
          width='32px'
          height='32px'
          ariaLabel={intl.formatMessage(i18nIconStrings[targetValue])}
        />
      ) : (
        <img
          aria-label={intl.formatMessage(i18nIconStrings[targetValue])}
          width='32px'
          height='32px'
          src={`data:image/svg+xml;base64,${iconString}`}
        />
      )}
    </Grid>
  );
};
