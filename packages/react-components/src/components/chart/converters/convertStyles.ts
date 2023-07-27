import { DataStream } from "@iot-app-kit/core";
import { ChartOptions, ChartStyleSettingsOptions } from "../types";
import { getDefaultStyles, getStyles } from "../utils/getStyles";

export const convertStyles =
  ({ defaultVisualizationType, styleSettings, significantDigits }: Pick<ChartOptions, 'defaultVisualizationType' | 'styleSettings' | 'significantDigits'>) =>
  ({ refId }: DataStream): ChartStyleSettingsOptions => {
    const defaultStyles = getDefaultStyles(defaultVisualizationType);
    const userDefinedStyles = getStyles(refId, styleSettings);

    return { ...defaultStyles, significantDigits, ...userDefinedStyles };
  };
