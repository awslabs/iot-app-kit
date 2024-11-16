import {
  colorBorderDividerSecondary,
  colorTextHeadingDefault,
  fontSizeBodyS,
  spaceStaticXs,
} from '@cloudscape-design/design-tokens';
import omitBy from 'lodash.omitby';
import { DEFAULT_DECIMAL_PLACES } from '../../common/constants';
import { Title } from '../../common/title';
import { getAggregationFrequency } from '../../utils/aggregationFrequency';
import { DEFAULT_KPI_SETTINGS } from './constants';
import { highContrastColor } from './highContrastColor';
import './kpi.css';
import {
  AggregationResolutionText,
  AlarmHeader,
  DataQuality,
  ErrorText,
  NameAndUnit,
  TimestampText,
  ValueText,
} from './kpiTextFragments';
import type { KPIBaseProperties, KPISettings } from './types';

export const KpiBase: React.FC<KPIBaseProperties> = ({
  propertyPoint,
  error,
  resolution,
  aggregationType,
  unit,
  name,
  isLoading,
  settings = {},
  significantDigits = DEFAULT_DECIMAL_PLACES,
  propertyThreshold,
  timeZone,
  titleText,
  alarmContent,
  alarmStatus,
  assistant,
}) => {
  const {
    showUnit,
    showName,
    showTimestamp,
    showDataQuality,
    showAggregationAndResolution,
    fontSize,
    secondaryFontSize,
  }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  const showFilledThreshold =
    propertyThreshold?.fill && propertyThreshold?.color;
  const nonThresholdBackground = settings.backgroundColor
    ? settings.backgroundColor
    : DEFAULT_KPI_SETTINGS.backgroundColor;
  const nonThresholdFontColor = settings.backgroundColor
    ? highContrastColor(nonThresholdBackground)
    : colorTextHeadingDefault;

  const backgroundColor = showFilledThreshold
    ? propertyThreshold.color
    : nonThresholdBackground;
  const fontColor = showFilledThreshold
    ? highContrastColor(propertyThreshold.color)
    : nonThresholdFontColor;
  const borderColor = showFilledThreshold
    ? highContrastColor(propertyThreshold.color)
    : settings.backgroundColor
    ? nonThresholdFontColor
    : colorBorderDividerSecondary;

  const point = propertyPoint;
  const aggregationResolutionString = getAggregationFrequency(
    resolution,
    aggregationType
  );

  if (error) {
    return (
      <div
        className='kpi'
        data-testid='kpi-error-component'
        style={{
          fontSize: `${secondaryFontSize}px`,
          backgroundColor: nonThresholdBackground,
          color: nonThresholdFontColor,
        }}
      >
        <Title
          text={titleText}
          style={{
            fontSize: `${secondaryFontSize}px`,
            color: fontColor,
            paddingLeft: `${spaceStaticXs}`,
          }}
        />
        <ErrorText
          {...{
            error,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className='kpi-container'
      data-testid='kpi-base-component'
      style={{ backgroundColor }}
    >
      <div className='kpi'>
        <div>
          <Title
            text={titleText}
            style={{
              fontSize: `${secondaryFontSize}px`,
              color: fontColor,
              paddingLeft: `${spaceStaticXs}`,
            }}
          />
          <AlarmHeader
            {...{
              fontColor,
              borderColor,
              alarmContent,
              alarmStatus,
              showFilledThreshold,
              backgroundColor: settings.backgroundColor,
              assistant,
            }}
          />
          <NameAndUnit
            {...{
              titleText,
              showName,
              name,
              showUnit,
              unit,
              isLoading,
              fontColor,
              secondaryFontSize,
            }}
          />
          <ValueText
            {...{ isLoading, fontSize, fontColor, point, significantDigits }}
          />
          <DataQuality
            {...{
              fontColor,
              showFilledThreshold,
              point,
              backgroundColor: settings.backgroundColor,
              showDataQuality,
              isLoading,
            }}
          />
        </div>
        {point && (
          <div
            className='timestamp-container'
            style={{
              fontSize: fontSizeBodyS,
              color: fontColor,
            }}
          >
            <AggregationResolutionText
              {...{
                showAggregationAndResolution,
                aggregationResolutionString,
                isLoading,
              }}
            />
            <TimestampText
              {...{ showTimestamp, point, borderColor, isLoading, timeZone }}
            />
          </div>
        )}
      </div>
      {!propertyThreshold?.fill && propertyThreshold?.color && (
        <div
          data-testid='kpi-side-threshold'
          style={{ backgroundColor: propertyThreshold?.color }}
          className='kpi-line-threshold'
        />
      )}
    </div>
  );
};
