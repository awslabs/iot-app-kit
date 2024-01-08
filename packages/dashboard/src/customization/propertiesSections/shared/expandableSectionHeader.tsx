import React from 'react';
import { Icon, SpaceBetween } from '@cloudscape-design/components';
import './styles.css';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import type { IconProps } from '@cloudscape-design/components';

type ExpandableSectionHeaderProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  buttonEnabled?: boolean;
  onClickButton?: MouseEventHandler;
  iconName?: IconProps.Name;
};
const ExpandableSectionHeader: FC<
  PropsWithChildren<ExpandableSectionHeaderProps>
> = (props) => {
  const {
    children,
    onClickButton,
    buttonEnabled = true,
    iconName = 'add-plus',
  } = props;

  const handleClickButton: MouseEventHandler = (e) => {
    if (!buttonEnabled || !onClickButton) return;
    onClickButton(e);
  };
  return (
    <SpaceBetween size='m' direction='horizontal'>
      {children}
      {onClickButton && (
        <span className='expandable-section-header-icon'>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div onClick={handleClickButton}>
            <Icon
              variant={buttonEnabled ? 'normal' : 'disabled'}
              name={iconName}
            />
          </div>
        </span>
      )}
    </SpaceBetween>
  );
};

export default ExpandableSectionHeader;
