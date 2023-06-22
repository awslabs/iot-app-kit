import { DataPoint } from '@iot-app-kit/core';

export const convertDataPoint = (point: DataPoint) => [point.x, point.y];
