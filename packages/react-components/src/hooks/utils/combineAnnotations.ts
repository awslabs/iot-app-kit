import { Annotations } from '@synchro-charts/core';

export const combineAnnotations = (prev?: Annotations, curr?: Annotations): Annotations => {
  return {
    ...prev,
    y: [...(prev?.y || []), ...(curr?.y || [])],
  };
};
