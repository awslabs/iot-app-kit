import React, { FC, useState } from 'react';

import { ThresholdSettings } from '@iot-app-kit/core';
import { nanoid } from '@reduxjs/toolkit';

import { Button, ExpandableSection, SpaceBetween } from '@cloudscape-design/components';

import ExpandableSectionHeader from '../shared/expandableSectionHeader';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import type { StyledThreshold, ThresholdWithId } from '~/customization/settings';
import { Maybe, maybeWithDefault } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';
import { useExpandable } from '../shared/useExpandable';
import { ThresholdsList } from './thresholdsList';
import { ComparisonOperators } from './comparisonOperators';
import { AnnotationsSettings } from './annotations';
import { CancelableEventHandler, ClickDetail } from '@cloudscape-design/components/internal/events';
import { ThresholdStyleSettings } from './thresholdStyle';
import { ThresholdStyleType } from '@iot-app-kit/react-components/src/components/chart/types';

const ThresholdsExpandableSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({ children, title }) => (
  <ExpandableSection headerText={<ExpandableSectionHeader>{title}</ExpandableSectionHeader>} defaultExpanded>
    <SpaceBetween size='m' direction='vertical'>
      {children}
    </SpaceBetween>
  </ExpandableSection>
);

type ThresholdsSectionProps = {
  thresholds?: Maybe<ThresholdWithId[] | undefined>;
  updateThresholds?: (newValue: ThresholdWithId[] | undefined) => void;
  comparisonOperators: ComparisonOperators;
  thresholdSettings?: Maybe<ThresholdSettings | undefined>;
  updateThresholdSettings?: (newValue: ThresholdSettings | undefined) => void;
  styledThresholds?: Maybe<(ThresholdWithId & StyledThreshold)[] | undefined>;
  updateStyledThresholds?: (newValue: (ThresholdWithId & StyledThreshold)[] | undefined) => void;
};

const ThresholdsSection: FC<ThresholdsSectionProps> = ({
  thresholds,
  updateThresholds,
  comparisonOperators,
  thresholdSettings,
  updateThresholdSettings,
  styledThresholds,
  updateStyledThresholds,
}) => {
  /**
   * If each widget in the selection do not share the exact same thresholds
   * then it is impossible to display them. If this is the case,
   * threholds ux will be disabled and we will show the SelectOneWidget component
   */
  const thresholdsEnabled = !!thresholds && !!updateThresholds;
  const thresholdsAdded = thresholdsEnabled && (maybeWithDefault([], thresholds)?.length ?? 0) > 0;
  const thresholdSettingsEnabled = !!thresholdSettings && !!updateThresholdSettings;
  const styledThresholdsEnabled = !!styledThresholds && !!updateStyledThresholds;
  /**
   * determines if we should show the toggle for coloring all breached data.
   * Some widgets doen't support this setting. Those widgets will have no
   * value for thresholdSettings and updateThresholdSettings
   */
  const annotationsEnabled = thresholdsAdded && thresholdSettingsEnabled;

  const [thresholdStyle, setThresholdStyle] = useState<ThresholdStyleType>({ visible: true });

  const [isExpanded, setIsExpanded] = useExpandable();

  /**
   * Helper function for returning displaying the proper thresholds component
   *
   * Thresholds will only be enabled if all widgets in the selection have the
   * same exact thresholds. This will be true if 1 widget is selected, or if
   * thresholds are added to multiple widgets in bulk.
   *
   * Because thresholds are created with a guid, if they are added individually,
   * they will not be considered the same as another even if they have a
   * value, color, and comparisonOperator in common.
   *
   * If the selection does not have all of the same thresholds, show a component
   * which instructs the user to select a single widget to configure.
   */
  const renderThresholds = () => {
    if (thresholdsEnabled || styledThresholdsEnabled) {
      const thresholdsValue = thresholds ? maybeWithDefault([], thresholds) ?? [] : [];
      const styledThresholdsValue = styledThresholds ? maybeWithDefault([], styledThresholds) ?? [] : [];
      const onAddNewThreshold: CancelableEventHandler<ClickDetail> = (e) => {
        e.stopPropagation();
        !isExpanded && setIsExpanded(true);
        const newThreshold: ThresholdWithId = {
          value: '',
          id: nanoid(),
          color: DEFAULT_THRESHOLD_COLOR,
          comparisonOperator: `EQ`,
        };
        if (thresholdsEnabled) {
          updateThresholds([...thresholdsValue, newThreshold]);
        }
        if (styledThresholdsEnabled) {
          const newStyledThreshold = {
            ...newThreshold,
            ...thresholdStyle,
          };
          updateStyledThresholds([...styledThresholdsValue, newStyledThreshold]);
        }
      };
      const thresholdsComponent = (
        <>
          <ThresholdsList
            thresholds={thresholdsEnabled ? thresholdsValue : (styledThresholdsEnabled ? styledThresholdsValue : [])}
            updateThresholds={thresholdsEnabled ? updateThresholds : updateStyledThresholds}
            comparisonOperators={comparisonOperators}
            thresholdStyle={thresholdStyle}
          />
          <Button onClick={onAddNewThreshold}>Add a threshold</Button>
        </>
      );
      return thresholdsComponent;
    }

    return <SelectOneWidget />;
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

  const renderThresholdStyle = () => {
    if (styledThresholdsEnabled) {
      const styledThresholdsValue = styledThresholds ? maybeWithDefault([], styledThresholds) ?? [] : [];
      const updateAllThresholdStyles = (thresholdStyle: ThresholdStyleType) => {
        const newStyledThresholds = styledThresholdsValue.map((threshold) => {
          const newThresholdStyle = {
            ...threshold,
            visible: thresholdStyle.visible,
            fill: thresholdStyle.fill ? threshold.color : undefined,
          };
          return newThresholdStyle;
        });
        updateStyledThresholds(newStyledThresholds);
      };

      return (
        <ThresholdStyleSettings
          thresholdStyle={thresholdStyle}
          setThresholdStyle={setThresholdStyle}
          updateAllThresholdStyles={updateAllThresholdStyles}
        />
      );
    }

    return null;
  };

  const thresholdsComponent = renderThresholds();
  const annotationsComponent = renderAnnotations();
  const thresholdsStyleComponent = renderThresholdStyle();

  return (
    <>
      <ThresholdsExpandableSection title='Thresholds'>{thresholdsComponent}</ThresholdsExpandableSection>
      {annotationsComponent && (
        <ThresholdsExpandableSection title='Threshold style'>{annotationsComponent}</ThresholdsExpandableSection>
      )}
      {thresholdsStyleComponent && (
        <ThresholdsExpandableSection title='Threshold style'>{thresholdsStyleComponent}</ThresholdsExpandableSection>
      )}
    </>
  );
};

export default ThresholdsSection;
