import { type Primitive } from '@iot-app-kit/core';

export const convertDataset = (gaugeValue?: Primitive) => {
  return {
    source: [[gaugeValue]],
  };
};
