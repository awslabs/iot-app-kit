import React, { createElement, FC, PropsWithChildren } from 'react';
import { Icon, IconProps } from '@cloudscape-design/components';
import './styles.css';

type ExpandableSectionHeaderProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  onClickButton?: (e: Event) => void;
  iconName?: IconProps.Name;
};
const ExpandableSectionHeader: FC<PropsWithChildren<ExpandableSectionHeaderProps>> = (props) => {
  const { children, onClickButton, iconName = 'add-plus', variant = 'h5' } = props;
  const element = createElement(variant, { className: 'expandable-section-header-text' }, children);
  return (
    <>
      {element}
      {onClickButton && (
        <span className="expandable-section-header-icon">
          <Icon name={iconName} />
        </span>
      )}
    </>
  );
};

export default ExpandableSectionHeader;
