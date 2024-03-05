import { DataStream, Threshold } from "@iot-app-kit/core";
import { ChartAxisOptions, ChartOptions, ChartStyleSettings, ChartStyleSettingsOptions, LineStyle, Visualization } from "../../types";
import { Emphasis } from "../../utils/getStyles";
import { SeriesOption } from "echarts";
import { DEEMPHASIZE_OPACITY, EMPHASIZE_SCALE_CONSTANT } from "../../eChartsConstants";
import { GenericSeries } from "../../../../echarts/types";
import merge from "lodash.merge";
import { useVisibleDataStreams } from "../../hooks/useVisibleDataStreams";
import { useHighlightedDataStreams } from "../../hooks/useHighlightedDataStreams";
import { useMemo } from "react";

type OptionalChartStyleSettingsOptions = Pick<
  ChartStyleSettingsOptions,
  'symbolColor' | 'yAxis' | 'color'
>;
type ChartStyleSettingsWithDefaults = Omit<
  Required<ChartStyleSettingsOptions>,
  keyof OptionalChartStyleSettingsOptions
> &
  OptionalChartStyleSettingsOptions

const DEFAULT_SERIES_STYLES: ChartStyleSettingsWithDefaults = {
  visualizationType: 'line',
  symbol: 'circle',
  symbolSize: 4,
  lineStyle: 'solid',
  lineThickness: 2,
  significantDigits: 4,
} as const;

// type ConvertSeriesOptions = {
//   id: string;
//   name?: string;
//   visualizationType?: Visualization;
//   color?: string;
//   symbol?: string;
//   symbolColor?: string;
//   symbolSize?: number,
//   lineStyle?: LineStyle,
//   lineThickness?: number,
//   emphasis?: Emphasis,
//   significantDigits?: number,
//   hidden?: boolean,
// };
// export const convertSeries = ({

// }: ConvertSeriesOptions) => {

// };

type DefaultSeriesStyleOptions = {

}

type DataStreamInfo = Pick<DataStream, 'id' | 'name' | 'refId' | 'color'> & { isHighlighted: boolean; isHidden: boolean; };

type CrossSeriesStyleOptions = Pick<
ChartOptions,
'defaultVisualizationType' | 'styleSettings' | 'significantDigits'
>;

type UpdateSeriesManagerOptions = {
  datastreams: DataStreamInfo[];
} & CrossSeriesStyleOptions & {
  performanceMode?: boolean;
}

type SeriesManagerOptions = {
  defaultSeriesStyles?: ChartStyleSettingsWithDefaults;
}

class SeriesManager {
  private defaultSeriesStyles: ChartStyleSettingsWithDefaults;
  private emphasisMode: boolean = false;
  private performanceMode: boolean = false;
  private styleSettingsMap: ChartStyleSettings = {};

  constructor (opts: SeriesManagerOptions = {}) {
    this.defaultSeriesStyles = opts.defaultSeriesStyles ?? DEFAULT_SERIES_STYLES;
  }

  convert (options: UpdateSeriesManagerOptions) {
    this.setCrossSeriesStyleSettings(options);

    
  }

  setCrossSeriesStyleSettings ({ datastreams, performanceMode, styleSettings, defaultVisualizationType, significantDigits }: UpdateSeriesManagerOptions) {
    this.emphasisMode = datastreams.some((datastream => datastream.isHighlighted));

    if (performanceMode) {
      this.performanceMode = performanceMode;
    }
    if (styleSettings) {
      this.styleSettingsMap = styleSettings;
    }
    if (defaultVisualizationType) {
      this.defaultSeriesStyles.visualizationType = defaultVisualizationType;
    }
    if (significantDigits) {
      this.defaultSeriesStyles.significantDigits = significantDigits;
    }
  }

  styleSettingsForDatastream ({ refId, color }: DataStreamInfo) {
    if (!refId) return this.defaultSeriesStyles;
    const userDefinedStyles = this.styleSettingsMap[refId];
    return merge(
      { ...this.defaultSeriesStyles },
      { color },
      { ...userDefinedStyles },
    );
  }

  isEmphasized ({ isHighlighted }: DataStreamInfo) {
    return this.emphasisMode && isHighlighted;
  }
  isDeemphasized ({ isHighlighted }: DataStreamInfo) {
    return this.emphasisMode && !isHighlighted;
  }

  convertOpacity (datastream: DataStreamInfo) {
    let opacity = 1;
  
    if (this.isDeemphasized(datastream)) {
      opacity = DEEMPHASIZE_OPACITY;
    }

    if (datastream.isHidden) {
      opacity = 0;
    }

    return opacity;
  }

  convertSymbolSize (datastream: DataStreamInfo) {
    const { symbolSize: symbolSizeFromSettings } = this.styleSettingsForDatastream(datastream);

    let symbolSize = symbolSizeFromSettings;
    if (this.isEmphasized(datastream)) {
      symbolSize = symbolSize + EMPHASIZE_SCALE_CONSTANT;
    }

    return symbolSize;
  }

  convertLineThickness (datastream: DataStreamInfo) {
    const { lineThickness: lineThicknessFromSettings } = this.styleSettingsForDatastream(datastream);

    let lineThickness = lineThicknessFromSettings;
    if (this.isEmphasized(datastream)) {
      lineThickness = lineThickness + EMPHASIZE_SCALE_CONSTANT;
    }

    return lineThickness;
  }

  convertVisualizationType ()

  convertSeries (datastream: DataStreamInfo) {
    const scaledSymbolSize =
      emphasis === 'emphasize'
        ? symbolSize + EMPHASIZE_SCALE_CONSTANT
        : symbolSize;
    const scaledLineThickness =
      emphasis === 'emphasize'
        ? lineThickness + EMPHASIZE_SCALE_CONSTANT
        : lineThickness;
    const symbolStyle =
      visualizationType !== 'scatter' && performanceMode ? 'none' : symbol;

    const genericSeries = {
      id,
      name: name ?? id,
      datasetIndex: index,
      type: convertVisualizationType(visualizationType),
      step: convertStep(visualizationType),
      symbol: symbolStyle,
      symbolSize: this.convertSymbolSize(datastream),
      itemStyle: {
        color: symbolColor ?? color,
        opacity,
      },
      lineStyle: {
        color,
        type: lineStyle,
        width: this.convertLineThickness(datastream),
        opacity: this.convertOpacity(datastream),
      },
      animation: false,
      appKitSignificantDigits: significantDigits,
      appKitColor: color,
    } as GenericSeries;
  }
}

const stepTypes: NonNullable<ChartStyleSettingsOptions['visualizationType']>[] =
  ['step-end', 'step-middle', 'step-start'];
const convertVisualizationType = (visualization: Visualization) =>
stepTypes.includes(visualization) ? 'line' : visualization;

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

const convertStyleSettings = ({ refId, color }: DataStreamInfo, {  styleSettings, defaultVisualizationType, significantDigits}: Pick<UpdateSeriesManagerOptions, 'defaultVisualizationType' | 'significantDigits' | 'styleSettings'>) => {
  let styles = DEFAULT_SERIES_STYLES;

  if (color) {
    styles = merge(styles, { color });
  }

  // chart level viz type
  if (defaultVisualizationType) {
    styles = merge(styles, { visualizationType: defaultVisualizationType });
  }

  // chart level sig digs
  if (significantDigits) {
    styles = merge(styles, { significantDigits });
  }

  if (refId && styleSettings) {
    const userDefinedStyles = styleSettings[refId] ?? {};
    styles = merge(styles, userDefinedStyles);
  };

  return styles;
}

type SeriesStyleSettings = CrossSeriesStyleOptions & {
  performanceMode?: boolean;
};

const useSeriesStyleSettings = ({ performanceMode, defaultVisualizationType, significantDigits }: SeriesStyleSettings) => {
  const seriesStyles = useMemo(() => {
    let styles = DEFAULT_SERIES_STYLES;
    // chart level viz type
    if (defaultVisualizationType) {
      styles = merge(styles, { visualizationType: defaultVisualizationType });
    }

    // chart level sig digs
    if (significantDigits) {
      styles = merge(styles, { significantDigits });
    }

    return styles;
  }, [defaultVisualizationType, significantDigits]);
};

const useSeries = (options: UpdateSeriesManagerOptions) => {
  const { isDataStreamHidden } = useVisibleDataStreams();
  const { highlightedDataStreams, isDataStreamHighlighted } =
    useHighlightedDataStreams();

  const emphasisMode = highlightedDataStreams.length > 0;

  useMemo(() => options.datastreams.map(datastream => {
    const { id, name, refId } = datastream;
    const { visualizationType, symbolSize } = convertStyleSettings(datastream, options);

    return {
      id,
      name: name ?? id,
      type: convertVisualizationType(visualizationType),
      step: convertStep(visualizationType),
      symbol: symbolStyle,
      symbolSize: this.convertSymbolSize(datastream),
      itemStyle: {
        color: symbolColor ?? color,
        opacity,
      },
      lineStyle: {
        color,
        type: lineStyle,
        width: this.convertLineThickness(datastream),
        opacity: this.convertOpacity(datastream),
      },
      animation: false,
      appKitSignificantDigits: significantDigits,
      appKitColor: color,
    } as GenericSeries;
  }), [])
}
