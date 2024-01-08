import React, { ReactNode } from 'react';
import { useExpandable } from '../useExpandable';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Toggle from '@cloudscape-design/components/toggle';

type StyleExpandableSectionProps = {
  visible?: boolean;
  setVisible: (visible: boolean) => void;
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
        setVisible(e.detail.checked);
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
  setVisible,
}) => {
  const [expanded, setExpanded] = useExpandable(true);

  return (
    <ExpandableSection
      className='accordian-header'
      expanded={expanded}
      variant='footer'
      onChange={(e) => setExpanded(e.detail.expanded)}
      headerText={
        <div className='expand-header'>
          <span>{header}</span>
          <StyleToggle setVisible={setVisible} visible={visible} />
        </div>
      }
    >
      {children || null}
    </ExpandableSection>
  );
};

export default StyleExpandableSection;
