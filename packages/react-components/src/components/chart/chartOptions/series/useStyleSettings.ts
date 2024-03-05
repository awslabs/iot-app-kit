import { useCallback, useMemo } from "react";
import { ChartOptions, ChartStyleSettingsOptions, Visualization } from "../../types";
import merge from "lodash.merge";
import { DataStream } from "@iot-app-kit/core";
import { useHighlightedDataStreams } from "../../hooks/useHighlightedDataStreams";
import { useVisibleDataStreams } from "../../hooks/useVisibleDataStreams";
import { GenericSeries } from "../../../../echarts/types";
import { DEEMPHASIZE_OPACITY, EMPHASIZE_SCALE_CONSTANT } from "../../eChartsConstants";
import { seriesId } from "../optionIdentifier";

type OptionalChartStyleSettingsOptions = Pick<
  ChartStyleSettingsOptions,
  'symbolColor' | 'yAxis' | 'color'
>;
export type ChartStyleSettingsWithDefaults = Omit<
  Required<ChartStyleSettingsOptions>,
  keyof OptionalChartStyleSettingsOptions
> &
  OptionalChartStyleSettingsOptions;


type DataStreamInfo = Pick<DataStream, 'id' | 'name' | 'refId' | 'color'>;
type ChartStyleSettings = Pick<ChartOptions, 'defaultVisualizationType' | 'significantDigits'>;
type DataStreamStyleSettings = Pick<ChartOptions, 'styleSettings'> & { performanceMode?: boolean };
type DataStreamStylerSettings = DataStreamInfo & DataStreamStyleSettings;

type SeriesStyleSettingsOptions = ChartStyleSettings & DataStreamStyleSettings;

const DEFAULT_SERIES_STYLES: GenericSeries = {
  type: 'line',
  step: false,
  symbol: 'circle',
  symbolSize: 4,
  itemStyle: {
    opacity: 1,
  },
  lineStyle: {
    type: 'solid',
    width: 2,
    opacity: 1,
  },
  animation: false,
  appKitSignificantDigits: 4,
} as const;

const stepTypes: NonNullable<ChartStyleSettingsOptions['visualizationType']>[] =
  ['step-end', 'step-middle', 'step-start'];
const convertVisualizationType = (
  visualizationType: Required<
    Pick<ChartStyleSettingsOptions, 'visualizationType'>
  >['visualizationType']
) => (stepTypes.includes(visualizationType) ? 'line' : visualizationType);

const convertStep = (
  visualizationType: Required<
    Pick<ChartStyleSettingsOptions, 'visualizationType'>
  >['visualizationType']
) => {
  if (!stepTypes.includes(visualizationType)) return false;
  switch (visualizationType) {
    case 'step-start':
      return 'start';
    case 'step-end':
      return 'end';
    case 'step-middle':
      return 'middle';
    default:
      return false;
  }
};

const getSeriesVisualizationOptions = (visualization?: Visualization) => visualization && ({
  type: convertVisualizationType(visualization),
  step: convertStep(visualization),
});

const applyNameAndId = ({ id, name }: DataStreamInfo) =>
  (seriesOption: GenericSeries): GenericSeries => {
    seriesOption = merge(seriesOption, {
      id: seriesId({ id }),
      name: name ?? id,
    })

    return seriesOption;
  };

const applyChartStyles = ({ defaultVisualizationType, significantDigits }: ChartStyleSettings) =>
  (seriesOption: GenericSeries): GenericSeries => {
      // chart level vizualization type
      if (defaultVisualizationType) {
        seriesOption = merge(seriesOption, getSeriesVisualizationOptions(defaultVisualizationType));
      }

      // chart level significant digits
      if (significantDigits) {
        seriesOption = merge(seriesOption, { appKitSignificantDigits: significantDigits });
      }
    return seriesOption;
  };

const applyDatastreamStyles = ({ color: datastreamColor, refId, styleSettings, performanceMode }: DataStreamStylerSettings) =>
  (seriesOption: GenericSeries): GenericSeries => {
    if (refId && styleSettings) {
      const { visualizationType, color: userDefinedColor, symbol, symbolSize, symbolColor, lineStyle, lineThickness } = styleSettings[refId] ?? {};
      const symbolStyle =
        visualizationType !== 'scatter' && performanceMode ? 'none' : symbol;

      const color = userDefinedColor ?? datastreamColor;

      seriesOption = merge(seriesOption, {
        ...getSeriesVisualizationOptions(visualizationType),
        symbol: symbolStyle,
        symbolSize,
        itemStyle: {
          color: symbolColor ?? color
        },
        lineStyle: {
          type: lineStyle,
          width: lineThickness,
          color,
        },
        appKitColor: color,
      });
    };

    return seriesOption;
  };



const applyHighlighting = ({ emphasisMode, isHighlighed }: {
  emphasisMode?: boolean;
  isHighlighed: boolean;
}) =>
  (seriesOption: GenericSeries): GenericSeries => {
    if (!emphasisMode) return seriesOption;

    const appliedSymbolSize = seriesOption.symbolSize;
    const appliedLineThickness = seriesOption.lineStyle?.width;

    if (isHighlighed) {
      // emphasize this series
      const symbolSize = typeof appliedSymbolSize === 'number' ? appliedSymbolSize + EMPHASIZE_SCALE_CONSTANT : appliedSymbolSize;
      const lineThickness = appliedLineThickness !== undefined ? appliedLineThickness + EMPHASIZE_SCALE_CONSTANT : appliedLineThickness;
      seriesOption = merge(seriesOption, {
        symbolSize,
        lineStyle: {
          width: lineThickness,
        }
      })
    } else {
      // emphasize this series
      seriesOption = merge(seriesOption, {
        itemStyle: {
          opacity: DEEMPHASIZE_OPACITY,
        },
        lineStyle: {
          opacity: DEEMPHASIZE_OPACITY,
        }
      })
    }

    return seriesOption;
  };

const applyVisibility = ({ isVisible }: {
  isVisible: boolean;
}) =>
  (seriesOption: GenericSeries): GenericSeries => {
    if (isVisible) return seriesOption;

    seriesOption = merge(seriesOption, {
      itemStyle: {
        opacity: 0,
      },
      lineStyle: {
        opacity: 0,
      }
    })

    return seriesOption;
  };

export const useSeriesCreator = ({ performanceMode, defaultVisualizationType, significantDigits, styleSettings }: SeriesStyleSettingsOptions) => {
  const { isDataStreamHidden } = useVisibleDataStreams();
  const { highlightedDataStreams, isDataStreamHighlighted } =
    useHighlightedDataStreams();
    
  const emphasisMode = useMemo(() => highlightedDataStreams.length > 0, [highlightedDataStreams]);

  return useCallback((datastreamInfo: DataStreamInfo) => {
    const identifierStyler = applyNameAndId(datastreamInfo);
    const chartStyler = applyChartStyles({ defaultVisualizationType, significantDigits });
    const dataStreamStyler = applyDatastreamStyles({ ...datastreamInfo, performanceMode, styleSettings });
    const highlightingStyler = applyHighlighting({ emphasisMode, isHighlighed: isDataStreamHighlighted(datastreamInfo) });
    const visibilityStyler = applyVisibility({ isVisible: !isDataStreamHidden(datastreamInfo) });

    return [identifierStyler, chartStyler, dataStreamStyler, highlightingStyler, visibilityStyler]
      .reduce((styles, fn) => {
        return fn(styles);
      }, DEFAULT_SERIES_STYLES);
  }, [
    performanceMode,
    emphasisMode,
    defaultVisualizationType,
    significantDigits,
    styleSettings,
    isDataStreamHidden,
    isDataStreamHighlighted,
  ]);
};

export const useSeries = (datastreams: DataStreamInfo[], settings: SeriesStyleSettingsOptions) => {
  const seriesCreator = useSeriesCreator(settings);

  return useMemo(() => datastreams.map(seriesCreator), [datastreams, seriesCreator])
};
