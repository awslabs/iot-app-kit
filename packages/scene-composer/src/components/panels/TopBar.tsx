import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { ButtonDropdown, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { KnownComponentType } from '../../interfaces';
import { sceneComposerIdContext } from '../../sceneComposerIdContext';
import { useViewOptionState } from '../../store';
import { CheckedIcon, UncheckedIcon } from '../../assets/svgs/icons/CheckMarkIcons';

const StyledSpaceBetween = styled(SpaceBetween)`
  flex: 1;
  justify-content: right;
`;

export const TopBar: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { motionIndicatorVisible, toggleMotionIndicatorVisibility } = useViewOptionState(sceneComposerId);
  const intl = useIntl();

  const settingsOnItemClick = ({ detail }) => {
    switch (detail.id) {
      case KnownComponentType.MotionIndicator:
        toggleMotionIndicatorVisibility();
        break;
    }
  };
  return (
    <StyledSpaceBetween direction='horizontal' size='xxs'>
      <ButtonDropdown
        data-testid={'view-options'}
        items={[
          {
            id: KnownComponentType.MotionIndicator,
            text: intl.formatMessage({
              defaultMessage: 'Motion indicator',
              description: 'dropdown button option text for motion indicator component',
            }),
            iconSvg: motionIndicatorVisible ? CheckedIcon : UncheckedIcon,
          },
        ]}
        onItemClick={settingsOnItemClick}
      >
        {intl.formatMessage({ defaultMessage: 'View Options', description: 'view options dropdown button text' })}
      </ButtonDropdown>
    </StyledSpaceBetween>
  );
};
