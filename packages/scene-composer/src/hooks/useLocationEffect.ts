import { useRef, useCallback, useEffect } from 'react';
import { Object3D } from 'three';

// doesn't traverse object because parent local space changes should ripple down
const useLocationEffect = (callback: (object: Object3D) => void, object?: Object3D) => {
  const originalLocationMap = useRef({});

  const restore = useCallback(() => {
    // if(object && object.userData?.isOriginal) {
    if (object) {
      const original = originalLocationMap.current[object.uuid];
      object.applyMatrix4(original ?? object.matrix);
    }
  }, [object]);

  useEffect(() => {
    if (object) {
      if (!originalLocationMap.current[object.uuid]) {
        originalLocationMap.current[object.uuid] = object.matrix.clone();
      }
    }
  }, [object]);

  const transform = () => {
    // Currently can't think of a use case where we'd want to use this to transform a material on a component we own
    // isOriginal could be an argument in the future.
    // console.log('is original?: ', object?.userData?.isOriginal);
    // if(object && object.userData?.isOriginal) {
    if (object) {
      console.log('applying location transform');
      callback(object);
    }
  };

  return [transform, restore];
};

export default useLocationEffect;
