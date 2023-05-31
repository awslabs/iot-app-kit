import React, { FC, MouseEventHandler } from 'react';

import { ThresholdSettings } from '@iot-app-kit/core';
import { nanoid } from '@reduxjs/toolkit';

import { ExpandableSection, SpaceBetween } from '@cloudscape-design/components';

import ExpandableSectionHeader from '../shared/expandableSectionHeader';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import type { ThresholdWithId } from '~/customization/settings';
import { Maybe, isJust, maybeWithDefault } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';
import { useExpandable } from '../shared/useExpandable';
import { ThresholdsList } from './thresholdsList';
import { ComparisonOperators } from './comparisonOperators';
import { AnnotationsSettings } from './annotations';

type ThresholdsExpandableSectionProps = {
  expanded: boolean;
  updateExpanded: (expanded: boolean) => void;
  onAddNewThreshold?: MouseEventHandler;
  addNewThresholdEnabled: boolean;
};
const ThresholdsExpandableSection: React.FC<React.PropsWithChildren<ThresholdsExpandableSectionProps>> = ({
  children,
  expanded,
  updateExpanded,
  onAddNewThreshold,
  addNewThresholdEnabled,
}) => (
  <ExpandableSection
    headerText={
      <ExpandableSectionHeader buttonEnabled={addNewThresholdEnabled} onClickButton={onAddNewThreshold}>
        Thresholds
      </ExpandableSectionHeader>
    }
    defaultExpanded
    expanded={expanded}
    onChange={(event) => updateExpanded(event.detail.expanded)}
  >
    <SpaceBetween size='m' direction='vertical'>
      {children}
    </SpaceBetween>
  </ExpandableSection>
);

type ThresholdsSectionProps = {
  thresholds: Maybe<ThresholdWithId[] | undefined>;
  updateThresholds: (newValue: ThresholdWithId[] | undefined) => void;
  comparisonOperators: ComparisonOperators;
  thresholdSettings?: Maybe<ThresholdSettings | undefined>;
  updateThresholdSettings?: (newValue: ThresholdSettings | undefined) => void;
};

const ThresholdsSection: FC<ThresholdsSectionProps> = ({
  thresholds,
  updateThresholds,
  comparisonOperators,
  thresholdSettings,
  updateThresholdSettings,
}) => {
  /**
   * If each widget in the selection do not share the exact same thresholds
   * then it is impossible to display them. If this is the case,
   * threholds ux will be disabled and we will show the SelectOneWidget component
   */
  const thresholdsEnabled = isJust(thresholds);
  const thresholdsAdded = thresholdsEnabled && (thresholds.value?.length ?? 0) > 0;
  const thresholdSettingsEnabled = !!thresholdSettings && !!updateThresholdSettings;
  /**
   * determines if we should show the toggle for coloring all breached data.
   * Some widgets doen't support this setting. Those widgets will have no
   * value for thresholdSettings and updateThresholdSettings
   */
  const annotationsEnabled = thresholdsAdded && thresholdSettingsEnabled;

  const [isExpanded, setIsExpanded] = useExpandable();

  /**
   * Helper function for returning displaying the proper thresholds component
   *
   * Threholds will only be enabled if all widgets in the selection have the
   * same exact threholds. This will be true if 1 widget is selected, or if
   * thresholds are added to multiple widgets in bulk.
   *
   * Because threholds are created with a guid, if they are added individually,
   * they will not be considered the same as another even if they have a
   * value, color, and comparisonOperator in common.
   *
   * If the selection does not have all of the same thresholds, show a component
   * which instructs the user to select a single widget to configure.
   */
  const renderThresholds = () => {
    if (thresholdsEnabled) {
      const thresholdsValue = thresholds.value ?? [];
      const onAddNewThreshold: MouseEventHandler = (e) => {
        e.stopPropagation();
        !isExpanded && setIsExpanded(true);
        const newThreshold: ThresholdWithId = {
          value: '',
          id: nanoid(),
          color: DEFAULT_THRESHOLD_COLOR,
          comparisonOperator: `EQ`,
        };
        updateThresholds([...thresholdsValue, newThreshold]);
      };
      const thresholdsComponent = (
        <ThresholdsList
          thresholds={thresholdsValue}
          updateThresholds={updateThresholds}
          comparisonOperators={comparisonOperators}
        />
      );
      return {
        onAddNewThreshold,
        thresholdsComponent,
      };
    }

    return {
      onAddNewThreshold: undefined,
      thresholdsComponent: <SelectOneWidget />,
    };
  };

  const renderAnnotations = () => {
    if (annotationsEnabled) {
      const settings = thresholdSettings ? maybeWithDefault({}, thresholdSettings) : {};
      const toggleColorBreachedData = (colorBreachedData: boolean) => {
        updateThresholdSettings({ ...settings, colorBreachedData });
      };

      const colorBreachedData = settings?.colorBreachedData ?? true;
      return (
        <AnnotationsSettings colorBreachedData={colorBreachedData} toggleColorBreachedData={toggleColorBreachedData} />
      );
    }

    return null;
  };

  const { onAddNewThreshold, thresholdsComponent } = renderThresholds();
  const annotationsComponent = renderAnnotations();

  return (
    <ThresholdsExpandableSection
      expanded={isExpanded}
      updateExpanded={setIsExpanded}
      onAddNewThreshold={onAddNewThreshold}
      addNewThresholdEnabled={thresholdsEnabled}
    >
      {annotationsComponent}
      {thresholdsComponent}
    </ThresholdsExpandableSection>
  );
};

export default ThresholdsSection;
