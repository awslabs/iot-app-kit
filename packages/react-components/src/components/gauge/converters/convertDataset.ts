import type { Primitive } from '@iot-app-kit/helpers';

export const convertDataset = (gaugeValue?: Primitive) => {
  return {
    source: [[gaugeValue]],
  };
};
