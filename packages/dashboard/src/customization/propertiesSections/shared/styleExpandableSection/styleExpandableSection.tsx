import React, { ReactNode } from 'react';
import { useExpandable } from '../useExpandable';
import Toggle from '@cloudscape-design/components/toggle';
import { StyledExpandableSection } from '../../components/styledComponents';
import { isFunction } from 'lodash';

type StyleExpandableSectionProps = {
  visible?: boolean;
  showToggle?: boolean;
  setVisible?: (visible: boolean) => void;
  header: string;
  children: ReactNode;
};

const StyleToggle = ({
  visible = true,
  setVisible,
}: Pick<StyleExpandableSectionProps, 'visible' | 'setVisible'>) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
  >
    <Toggle
      onChange={(e) => {
        if (isFunction(setVisible)) setVisible(e.detail.checked);
      }}
      checked={visible}
    >
      View on chart
    </Toggle>
  </div>
);

const StyleExpandableSection: React.FC<StyleExpandableSectionProps> = ({
  header,
  children,
  visible,
  showToggle = true,
  setVisible,
}) => {
  const [expanded, setExpanded] = useExpandable(true);

  return (
    <StyledExpandableSection
      className='accordian-header'
      expanded={expanded}
      variant='footer'
      onChange={(e) => setExpanded(e.detail.expanded)}
      headerText={
        <div className='expand-header'>
          <span>{header}</span>
          {showToggle && (
            <StyleToggle setVisible={setVisible} visible={visible} />
          )}
        </div>
      }
    >
      {children || null}
    </StyledExpandableSection>
  );
};

export default StyleExpandableSection;
