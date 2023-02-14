import React, { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { Icon, IconProps } from '@cloudscape-design/components';
import './styles.css';

type ExpandableSectionHeaderProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  onClickButton?: MouseEventHandler;
  iconName?: IconProps.Name;
};
const ExpandableSectionHeader: FC<PropsWithChildren<ExpandableSectionHeaderProps>> = (props) => {
  const { children, onClickButton, iconName = 'add-plus' } = props;
  return (
    <>
      {children}
      {onClickButton && (
        <span className='expandable-section-header-icon'>
          <div onClick={onClickButton}>
            <Icon name={iconName} />
          </div>
        </span>
      )}
    </>
  );
};

export default ExpandableSectionHeader;
