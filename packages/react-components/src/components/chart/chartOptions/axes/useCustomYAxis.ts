import { DataStream } from "@iot-app-kit/core";
import { ChartOptions } from "../../types";
import { useCallback, useMemo } from "react";
import { isDefined } from "../../../../utils/predicates";
import { customYAxisId } from "../optionIdentifier";

type DataStreamInfo = Pick<DataStream, 'id' | 'name' | 'refId' | 'color'>;
type DataStreamStyleSettings = Pick<ChartOptions, 'styleSettings'>;

// type CustomYAxisOptions = {}
export const useCustomYAxes = (datastreams: DataStreamInfo[], { styleSettings }: DataStreamStyleSettings) => {
  const yAxisCreator = useCallback(({ id, refId, color }: DataStreamInfo) => {
    if (refId && styleSettings) {
      const { yAxis } = styleSettings[refId] ?? {};
      
      if (!yAxis) return undefined;

      return {
        /**
         * showing the axis only to ensure that the horizontal
         * mark lines are visible
         *
         * axis label refers to the numbers at each mark line
         */
        id: customYAxisId({ id }),
        show: true,
        axisLabel: { show: false },
        name: yAxis.yLabel,
        min: yAxis.yMin,
        max: yAxis.yMax,
        alignTicks: true,
        axisLine: {
          lineStyle: {
            color,
          },
        },
      };
    };
  }, [styleSettings]);

  return useMemo(() => datastreams.map(yAxisCreator).filter(isDefined), [datastreams, yAxisCreator])
};
