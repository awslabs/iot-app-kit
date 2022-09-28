import { EventManager, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { Camera } from 'three';
import React, { forwardRef, useContext, useEffect, useMemo } from 'react';

import { TripodControlsImpl } from '../../../three/TripodControlsImpl';
import { useEditorState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';

export type TripodControlsProps = Omit<
  ReactThreeFiber.Overwrite<
    ReactThreeFiber.Object3DNode<TripodControlsImpl, typeof TripodControlsImpl>,
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

export const TripodControls = forwardRef<TripodControlsImpl, TripodControlsProps>(
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
    const controls = useMemo(() => new TripodControlsImpl(explCamera), [explCamera]);

    const sceneComposerId = useContext(sceneComposerIdContext);
    const { cameraControlsType } = useEditorState(sceneComposerId);

    useFrame(() => {
      if (cameraControlsType !== 'immersive') return;
      if (controls.enabled) controls.update();
    });

    useEffect(() => {
      const callback = (e: Event) => {
        invalidate();
        if (regress) performance.regress();
        if (onChange) onChange(e);
      };

      controls.connect(explDomElement);
      controls.addEventListener('change', callback as any);

      if (onStart) controls.addEventListener('start', onStart as any);
      if (onEnd) controls.addEventListener('end', onEnd as any);

      return () => {
        controls.removeEventListener('change', callback as any);
        if (onStart) controls.removeEventListener('start', onStart as any);
        if (onEnd) controls.removeEventListener('end', onEnd as any);
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
