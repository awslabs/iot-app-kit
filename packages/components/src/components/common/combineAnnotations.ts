import { Annotations } from '@synchro-charts/core';

export const combineAnnotations = (prev: Annotations, cur: Annotations): Annotations => {
  return {
    ...prev,
    y: [...(prev?.y || []), ...(cur?.y || [])],
  };
};
