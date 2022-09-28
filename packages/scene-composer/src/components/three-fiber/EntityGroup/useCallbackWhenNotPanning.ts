import { ThreeEvent } from '@react-three/fiber';
import { useRef, useCallback } from 'react';

/**
 * This is not generic enough a hook to be used in the rest of the application, and has
 * a dumb name but I can't think of a better one. It's necessary to avoid selecting things
 * unncessarily, but it's also kind of use case specific. Let's see if similar use cases
 * preset themselves int he future, and we can get a better idea of the right way to design
 * this.
 * @param callback Callback method to call when the state is valid, and the user clicks the target
 * @param deps An array of objects that should trigger a rereder of this hook
 * @param acceptableDriftDistance optional override of the acceptable mouse move distance to before we treat something as being "dragged"
 * @returns onPointerDown and onPointerUp event handlers (you should assign these to your component)
 */
const useCallbackWhenNotPanning = (callback, deps, acceptableDriftDistance = 1) => {
  const lastPointerDownLocation = useRef<[number, number] | null>(null);

  const onPointerUp = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const lastPointerPosition = lastPointerDownLocation.current;
      const { clientX, clientY } = e;
      if (!lastPointerPosition) {
        return;
      }

      const [lastX, lastY] = lastPointerPosition;
      const isPanning: boolean =
        Math.abs(clientX - lastX) > acceptableDriftDistance || Math.abs(clientY - lastY) > acceptableDriftDistance;

      if (isPanning) return;

      callback(e);
    },
    [callback, ...deps],
  );

  const onPointerDown = useCallback(
    ({ clientX, clientY }) => {
      lastPointerDownLocation.current = [clientX, clientY];
    },
    [callback, ...deps],
  );

  return [onPointerDown, onPointerUp];
};

export default useCallbackWhenNotPanning;
