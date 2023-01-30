import { Annotations } from '../charts/common/types';

export const combineAnnotations = (prev?: Annotations, curr?: Annotations): Annotations => {
  return {
    ...prev,
    y: [...(prev?.y || []), ...(curr?.y || [])],
  };
};
