import {
  Button,
  type ButtonProps,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import {
  type ComparisonOperator,
  type StyledThreshold,
  type ThresholdSettings,
  type ThresholdStyleType,
} from '@iot-app-kit/core';
import { nanoid } from '@reduxjs/toolkit';
import { type FC, useState } from 'react';
import type { ThresholdWithId } from '../../../customization/settings';
import { type Maybe, maybeWithDefault } from '../../../util/maybe';
import { StyledExpandableSection } from '../components/styledComponents';
import '../propertiesSectionsStyle.css';
import { SelectOneWidget } from '../shared/selectOneWidget';
import { useExpandable } from '../shared/useExpandable';
import { AnnotationsSettings } from './annotations';
import { type ComparisonOperators } from './comparisonOperators';
import {
  convertOptionToThresholdStyle,
  convertThresholdStyleToOption,
  styledOptions,
} from './defaultThresholds';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import {
  convertOptionToThresholdStyleKPI,
  convertThresholdStyleToOptionKPI,
  styledOptionsKPI,
} from './kpiThresholds';
import { ThresholdsList } from './thresholdsList';
import { ThresholdStyleSettings } from './thresholdStyle';

const ThresholdsExpandableSection: React.FC<
  React.PropsWithChildren<{ title: string }>
> = ({ children, title }) => (
  <StyledExpandableSection
    className='accordian-header'
    headerText={title}
    defaultExpanded
  >
    <SpaceBetween size='m' direction='vertical'>
      {children}
    </SpaceBetween>
  </StyledExpandableSection>
);

type ThresholdsSectionProps = {
  widgetType: string;
  thresholds?: Maybe<ThresholdWithId[] | undefined>;
  updateThresholds?: (newValue: ThresholdWithId[] | undefined) => void;
  comparisonOperators: ComparisonOperators;
  thresholdSettings?: Maybe<ThresholdSettings | undefined>;
  updateThresholdSettings?: (newValue: ThresholdSettings | undefined) => void;
  styledThresholds?: Maybe<(ThresholdWithId & StyledThreshold)[] | undefined>;
  updateStyledThresholds?: (
    newValue: (ThresholdWithId & StyledThreshold)[] | undefined
  ) => void;
};

const ThresholdsSection: FC<ThresholdsSectionProps> = ({
  widgetType,
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
  const thresholdsAdded =
    thresholdsEnabled && (maybeWithDefault([], thresholds)?.length ?? 0) > 0;
  const thresholdSettingsEnabled =
    !!thresholdSettings && !!updateThresholdSettings;
  const styledThresholdsEnabled =
    !!styledThresholds && !!updateStyledThresholds;
  const styledThresholdsAdded =
    styledThresholdsEnabled &&
    (maybeWithDefault([], styledThresholds)?.length ?? 0) > 0;
  /**
   * determines if we should show the toggle for coloring all breached data.
   * Some widgets doen't support this setting. Those widgets will have no
   * value for thresholdSettings and updateThresholdSettings
   */
  const annotationsEnabled = thresholdsAdded && thresholdSettingsEnabled;

  /**
   * Handle threshold style when the dashboard is saved. Determine style state based
   * on saved threshold properties 'visible' and 'fill'
   */

  // Only care about the 'visible' field here, but need to fill in required fields
  const defaultStyledThreshold = {
    color: '',
    value: '',
    comparisonOperator: 'EQ' as ComparisonOperator,
    id: '1',
    visible: true,
  };
  // Set default threshold style if no thresholds are added
  let defaultThresholdStyle: ThresholdStyleType = convertOptionToThresholdStyle(
    styledOptions[2]
  );
  if (styledThresholdsAdded) {
    // All threshold styles are the same, check on any of the thresholds to determine the saved style
    const styledThreshold: (ThresholdWithId & StyledThreshold)[] =
      maybeWithDefault([defaultStyledThreshold], styledThresholds) ?? [
        defaultStyledThreshold,
      ];
    defaultThresholdStyle = {
      visible: styledThreshold[0].visible,
      fill: styledThreshold[0].fill,
    };
  }
  const [thresholdStyle, setThresholdStyle] = useState<ThresholdStyleType>(
    defaultThresholdStyle
  );

  const [isExpanded, setIsExpanded] = useExpandable();

  // Hide all thresholds button state can be saved, determined by the saved threshold properties 'visible' and 'fill'
  const defaultShouldHideThresholds =
    defaultThresholdStyle.visible === false &&
    defaultThresholdStyle.fill === undefined;
  const [shouldHideThresholds, setShouldHideThresholds] = useState<boolean>(
    defaultShouldHideThresholds
  );

  /**
   * Wrapper for updating styled thresholds
   * If a threshold's comparison operator is "=" then always show a visible line
   * If the update to thresholds is a new style then pass it into this function, otherwise use the style state
   * If the thresholds should be hidden then ensure they are turned off
   */
  const handleUpdateStyledThresholds = (
    updatedThresholds: (ThresholdWithId & StyledThreshold)[] | undefined,
    shouldHide?: boolean,
    newThresholdStyle?: ThresholdStyleType
  ) => {
    if (updateStyledThresholds) {
      const thresholds = updatedThresholds?.map((t) => {
        // Use the provided new style or the current thresholdStyle state
        const visibleStyle = newThresholdStyle
          ? newThresholdStyle.visible
          : thresholdStyle.visible;
        // Use the provided shouldHide or the current shouldHideThresholds state
        const resolveShouldHide =
          shouldHide !== undefined ? shouldHide : shouldHideThresholds;

        const updateThreshold = t;
        if (!resolveShouldHide) {
          // Always set '=' to be visible
          updateThreshold.visible =
            t.comparisonOperator === 'EQ' ? true : visibleStyle;
        } else {
          // If should be hidden then always hide
          updateThreshold.visible = false;
          updateThreshold.fill = undefined;
        }
        return updateThreshold;
      });
      updateStyledThresholds(thresholds);
    }
  };

  /**
   * Handler for the hide thresholds toggle
   * If toggled on then update thresholds to be hidden
   * If toggled off then update thresholds to use the default or current style
   */
  const handleUpdateHideAllThresholds = (checked: boolean) => {
    setShouldHideThresholds(checked);
    if (styledThresholdsEnabled) {
      const t = maybeWithDefault([], styledThresholds) ?? [];
      const newThresholds = t.map((threshold) => {
        const defaultStyle = { visible: true, fill: undefined };
        const style =
          thresholdStyle.visible === false && thresholdStyle.fill === undefined
            ? defaultStyle
            : thresholdStyle;
        return {
          ...threshold,
          visible: checked ? false : style.visible,
          fill: checked ? undefined : style.fill,
        };
      });
      handleUpdateStyledThresholds(newThresholds, checked);
    }
  };

  const hideThresholdsToggle = (
    <Toggle
      onChange={({ detail }) => handleUpdateHideAllThresholds(detail.checked)}
      checked={shouldHideThresholds}
    >
      Hide all thresholds
    </Toggle>
  );

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
    let comparisonOperator = 'EQ' as ComparisonOperator;

    // Gauge threshold do not contain EQ
    if (widgetType === 'gauge') {
      comparisonOperator = 'GT';
    }

    if (thresholdsEnabled || styledThresholdsEnabled) {
      const thresholdsValue = thresholds
        ? maybeWithDefault([], thresholds) ?? []
        : [];
      const styledThresholdsValue = styledThresholds
        ? maybeWithDefault([], styledThresholds) ?? []
        : [];
      const onAddNewThreshold: NonNullable<ButtonProps['onClick']> = (e) => {
        e.stopPropagation();
        !isExpanded && setIsExpanded(true);
        const newThreshold: ThresholdWithId = {
          value: '',
          id: nanoid(),
          color: DEFAULT_THRESHOLD_COLOR,
          comparisonOperator: comparisonOperator,
        };
        if (thresholdsEnabled) {
          updateThresholds([...thresholdsValue, newThreshold]);
        }
        if (styledThresholdsEnabled) {
          const newStyledThreshold = {
            ...newThreshold,
            ...thresholdStyle,
          };
          handleUpdateStyledThresholds([
            ...styledThresholdsValue,
            newStyledThreshold,
          ]);
        }
      };

      const thresholdComponentStyle = {
        padding: spaceScaledXs,
      };

      const thresholdsComponent = (
        <div style={thresholdComponentStyle}>
          <SpaceBetween size='m' direction='vertical'>
            {styledThresholdsEnabled && hideThresholdsToggle}
            <ThresholdsList
              thresholds={
                thresholdsEnabled
                  ? thresholdsValue
                  : styledThresholdsEnabled
                  ? styledThresholdsValue
                  : []
              }
              updateThresholds={
                thresholdsEnabled
                  ? updateThresholds
                  : handleUpdateStyledThresholds
              }
              comparisonOperators={comparisonOperators}
            />
            <Button onClick={onAddNewThreshold}>Add a threshold</Button>
          </SpaceBetween>
        </div>
      );
      return thresholdsComponent;
    }

    return <SelectOneWidget />;
  };

  const renderAnnotations = () => {
    if (annotationsEnabled) {
      const settings = thresholdSettings
        ? maybeWithDefault({}, thresholdSettings)
        : {};
      const toggleColorBreachedData = (colorBreachedData: boolean) => {
        updateThresholdSettings({ ...settings, colorBreachedData });
      };

      const colorBreachedData = settings?.colorBreachedData ?? true;
      return (
        <AnnotationsSettings
          colorBreachedData={colorBreachedData}
          toggleColorBreachedData={toggleColorBreachedData}
        />
      );
    }

    return null;
  };

  const renderThresholdStyle = () => {
    if (styledThresholdsEnabled) {
      const styledThresholdsValue = styledThresholds
        ? maybeWithDefault([], styledThresholds) ?? []
        : [];
      const updateAllThresholdStyles = (thresholdStyle: ThresholdStyleType) => {
        // Update threshold style state
        setThresholdStyle(thresholdStyle);
        if (!shouldHideThresholds) {
          const newStyledThresholds = styledThresholdsValue.map((threshold) => {
            const newThresholdStyle = {
              ...threshold,
              visible:
                threshold.comparisonOperator === 'EQ'
                  ? true
                  : thresholdStyle.visible,
              fill: thresholdStyle.fill ? threshold.color : undefined,
            };
            return newThresholdStyle;
          });
          // Update all thresholds
          handleUpdateStyledThresholds(
            newStyledThresholds,
            shouldHideThresholds,
            thresholdStyle
          );
        }
      };

      const isStatusOrKPI = widgetType === 'kpi' || widgetType === 'status';

      return (
        <ThresholdStyleSettings
          thresholdStyle={thresholdStyle}
          updateAllThresholdStyles={updateAllThresholdStyles}
          convertThresholdStyleToOption={
            isStatusOrKPI
              ? convertThresholdStyleToOptionKPI
              : convertThresholdStyleToOption
          }
          convertOptionToThresholdStyle={
            isStatusOrKPI
              ? convertOptionToThresholdStyleKPI
              : convertOptionToThresholdStyle
          }
          styledOptions={isStatusOrKPI ? styledOptionsKPI : styledOptions}
        />
      );
    }

    return null;
  };

  const thresholdsComponent = renderThresholds();
  const annotationsComponent = renderAnnotations();
  const thresholdsStyleComponent = renderThresholdStyle();

  return (
    <div className='remove-scroll'>
      <ThresholdsExpandableSection title='Thresholds'>
        {thresholdsComponent}
      </ThresholdsExpandableSection>
      {annotationsComponent && (
        <ThresholdsExpandableSection title='Threshold style'>
          {annotationsComponent}
        </ThresholdsExpandableSection>
      )}
      {thresholdsStyleComponent && (
        <ThresholdsExpandableSection title='Threshold style'>
          {thresholdsStyleComponent}
        </ThresholdsExpandableSection>
      )}
    </div>
  );
};

export default ThresholdsSection;
