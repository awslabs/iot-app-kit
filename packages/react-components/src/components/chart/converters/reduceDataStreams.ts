import { DataPoint } from "@iot-app-kit/core";
import { reduceSeriesAndYAxis } from "./convertSeriesAndYAxis";
import { ConvertedDataStream, YAxisLegendOption } from "./defaultConvertedDataStream";
import { mapDataStreams } from "./mapDataStreams";

const appendYAxisLegend = (
  existingLegend: YAxisLegendOption[],
  legendToAdd: YAxisLegendOption
) => ([...existingLegend, legendToAdd]);

const createYAxisLegendOption = (point?: DataPoint, { id, color, significantDigits }: { id?: string; color?: string; significantDigits?: number; } = { }) => ({
  id: id ?? '',
  color,
  significantDigits,
  value: point,
});

const reduceYMinMaxLegends = (accumulator: ConvertedDataStream, nextInput: MappedInput) => {
  const { yMin: yMinAccumulated, yMax: yMaxAccumulated } = accumulator.legend;
  const { id, color, significantDigits, yMax, yMin } = nextInput;
  return {
    legend: {
      yMax: appendYAxisLegend(yMaxAccumulated, createYAxisLegendOption(yMax, { id, color, significantDigits })),
      yMin: appendYAxisLegend(yMinAccumulated, createYAxisLegendOption(yMin, { id, color, significantDigits })),
    }
  }
};

type MappedInput = ReturnType<ReturnType<typeof mapDataStreams>>;

export const reduceDataStreams = (accumulator: ConvertedDataStream, nextInput: MappedInput): ConvertedDataStream => {
  const { series, yAxis } = reduceSeriesAndYAxis(accumulator, nextInput);
  const { legend } = reduceYMinMaxLegends(accumulator, nextInput);

  return ({
    series,
    yAxis,
    legend,
  })
};
