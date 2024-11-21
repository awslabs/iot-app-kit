import { type EventManager, type ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo } from 'react';
import type { Camera, Event } from 'three';

import { OrbitControls as OrbitControlsImpl } from '../../../three/OrbitControls';

export type OrbitControlsProps = Omit<
  ReactThreeFiber.Overwrite<
    ReactThreeFiber.Object3DNode<OrbitControlsImpl, typeof OrbitControlsImpl>,
    {
      camera?: Camera;
      domElement?: HTMLElement;
      enableDamping?: boolean;
      makeDefault?: boolean;
      onChange?: (e?: Event) => void;
      onEnd?: (e?: Event) => void;
      onStart?: (e?: Event) => void;
      regress?: boolean;
      target?: ReactThreeFiber.Vector3;
    }
  >,
  'ref'
>;

export const OrbitControls = forwardRef<OrbitControlsImpl, OrbitControlsProps>(
  ({ makeDefault, camera, regress, domElement, enableDamping = true, onChange, onStart, onEnd, ...restProps }, ref) => {
    const invalidate = useThree(({ invalidate }) => invalidate);
    const defaultCamera = useThree(({ camera }) => camera);
    const gl = useThree(({ gl }) => gl);
    const events = useThree(({ events }) => events) as EventManager<HTMLElement>;
    const set = useThree(({ set }) => set);
    const get = useThree(({ get }) => get);
    const performance = useThree(({ performance }) => performance);
    const explCamera = camera || defaultCamera;
    const explDomElement = domElement || (typeof events.connected !== 'boolean' ? events.connected : gl.domElement);
    const controls = useMemo(() => new OrbitControlsImpl(explCamera), [explCamera]);

    // @ts-expect-error type mistmatch after upgrade
    events.filter = (items: THREE.Intersection[]): THREE.Intersection[] => {
      return items.filter((item: THREE.Intersection) => {
        return !!item.face || !!item.faceIndex || item.object.type === 'Sprite';
      });
    };

    useFrame(() => {
      if (controls.enabled) controls.update();
    });

    useEffect(() => {
      const callback = (e: Event) => {
        invalidate();
        if (regress) performance.regress();
        if (onChange) onChange(e);
      };

      // Disable raycaster on wheel, enable on pointerdown
      const domElement = explDomElement || gl.domElement;

      controls.connect(domElement);
      controls.addEventListener('change', callback);

      if (onStart) controls.addEventListener('start', onStart);
      if (onEnd) controls.addEventListener('end', onEnd);

      return () => {
        controls.removeEventListener('change', callback);
        if (onStart) controls.removeEventListener('start', onStart);
        if (onEnd) controls.removeEventListener('end', onEnd);
        controls.dispose();
      };
    }, [explDomElement, onChange, onStart, onEnd, regress, controls, invalidate]);

    useEffect(() => {
      if (makeDefault) {
        const old = get().controls;
        set({ controls });
        return () => set({ controls: old });
      }
    }, [makeDefault, controls]);

    return <primitive ref={ref} object={controls} enableDamping={enableDamping} {...restProps} />;
  },
);
