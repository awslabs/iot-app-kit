import { DataPoint, DataStream } from "@iot-app-kit/core";
import maxBy from "lodash.maxby";
import minBy from "lodash.minby";

import { convertStyles } from "./convertStyles";
import { ChartOptions } from "../types";
import { convertSeriesAndYAxis } from "./convertSeriesAndYAxis";

const dataValue = (point: DataPoint) => point.y;

type PartialChartOptions = Pick<ChartOptions, "defaultVisualizationType" | "styleSettings" | "significantDigits">;

export const mapDataStreams = (options: PartialChartOptions) =>
  (datastream: DataStream) => {
    const styles = convertStyles(options)(datastream);

    const { color, significantDigits } = styles;
    const { data, id } = datastream;

    const { series, yAxis } = convertSeriesAndYAxis(styles)(datastream);

    const yMax = maxBy(data, dataValue);
    const yMin = minBy(data, dataValue);

    return ({
      id,
      series,
      yAxis,
      color,
      significantDigits,
      yMax,
      yMin,
    })
  };
