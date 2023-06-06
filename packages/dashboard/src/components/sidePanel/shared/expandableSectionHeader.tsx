import React from 'react';
import { Icon, SpaceBetween } from '@cloudscape-design/components';
import './styles.css';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import type { IconProps } from '@cloudscape-design/components';

type ExpandableSectionHeaderProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  onClickButton?: MouseEventHandler;
  iconName?: IconProps.Name;
};
const ExpandableSectionHeader: FC<PropsWithChildren<ExpandableSectionHeaderProps>> = (props) => {
  const { children, onClickButton, iconName = 'add-plus' } = props;
  return (
    <>
      <SpaceBetween size='m' direction='horizontal'>
        {children}
        {onClickButton && (
          <span className='expandable-section-header-icon'>
            <div onClick={onClickButton}>
              <Icon name={iconName} />
            </div>
          </span>
        )}
      </SpaceBetween>
    </>
  );
};

export default ExpandableSectionHeader;
