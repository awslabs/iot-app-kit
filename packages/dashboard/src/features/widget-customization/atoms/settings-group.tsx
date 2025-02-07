import CloudscapeExpandableSection from '@cloudscape-design/components/expandable-section';
import { type PropsWithChildren, type ReactNode } from 'react';

export interface SettingsGroupProps extends PropsWithChildren {
  headerText: string;
  controls?: ReactNode;
}

export const SettingsGroup = ({
  headerText,
  controls,
  children,
}: SettingsGroupProps) => {
  return (
    <CloudscapeExpandableSection
      defaultExpanded
      headerText={headerText}
      headerActions={controls}
    >
      {children}
    </CloudscapeExpandableSection>
  );
};
