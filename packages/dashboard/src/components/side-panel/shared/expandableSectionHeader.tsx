import React, { FC } from 'react';
import { Icon } from '@cloudscape-design/components';
import './styles.css';

const ExpandableSectionHeader: FC<{ text: string; onClickButton?: (e: Event) => void }> = ({ text, onClickButton }) => {
  return (
    <>
      {text}
      {onClickButton && (
        <span className="expandable-section-header-icon">
          <Icon name="add-plus" />
        </span>
      )}
    </>
  );
};

export default ExpandableSectionHeader;
