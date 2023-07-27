import { DataPoint } from "@iot-app-kit/core";
import { SeriesOption, YAXisComponentOption } from "echarts";

export type YAxisLegendOption = { id: string; color?: string; value?: DataPoint, significantDigits?: number; };

export type ConvertedDataStream = {
  series: SeriesOption[];
  yAxis: YAXisComponentOption[];
  legend: {
    yMin: YAxisLegendOption[];
    yMax: YAxisLegendOption[];
  };
};

export const getInitialConvertedDataStream = (options: Partial<ConvertedDataStream>): ConvertedDataStream => ({
  series: [],
  yAxis: [],
  legend: {
    yMin: [],
    yMax: [],
  },
  ...options,
});
