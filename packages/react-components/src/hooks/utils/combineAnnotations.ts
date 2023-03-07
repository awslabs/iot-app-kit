import { Annotations } from '@iot-app-kit/core';

export const combineAnnotations = (prev?: Annotations, curr?: Annotations): Annotations => {
  return {
    ...prev,
    y: [...(prev?.y || []), ...(curr?.y || [])],
  };
};
