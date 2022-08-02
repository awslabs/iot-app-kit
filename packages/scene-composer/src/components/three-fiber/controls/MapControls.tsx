import { ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { Camera, Event } from 'three';

import { MapControls as MapControlsImpl } from '../../../three/OrbitControls';

export type MapControlsProps = ReactThreeFiber.Overwrite<
  ReactThreeFiber.Object3DNode<MapControlsImpl, typeof MapControlsImpl>,
  {
    target?: ReactThreeFiber.Vector3;
    camera?: Camera;
    onChange?: (e?: Event) => void;
    onStart?: (e?: Event) => void;
    onEnd?: (e?: Event) => void;
  }
>;

export const MapControls = forwardRef<MapControlsImpl, MapControlsProps>((props = { enableDamping: true }, ref) => {
  const { camera, onChange, onStart, onEnd, ...rest } = props;
  const invalidate = useThree(({ invalidate }) => invalidate);
  const defaultCamera = useThree(({ camera }) => camera);
  const domElement = useThree(({ gl }) => gl.domElement);

  const explCamera = camera || defaultCamera;
  const controls = useMemo(() => new MapControlsImpl(explCamera), [explCamera]);

  useEffect(() => {
    controls.connect(domElement);
    const callback = (e: Event) => {
      invalidate();
      if (onChange) onChange(e);
    };
    controls.addEventListener('change', callback);

    if (onStart) controls.addEventListener('start', onStart);
    if (onEnd) controls.addEventListener('end', onEnd);

    return () => {
      controls.dispose();
      controls.removeEventListener('change', callback);
      if (onStart) controls.removeEventListener('start', onStart);
      if (onEnd) controls.removeEventListener('end', onEnd);
    };
  }, [onChange, onStart, onEnd, controls, invalidate, domElement]);

  useFrame(() => controls.update());

  return <primitive ref={ref} dispose={undefined} object={controls} enableDamping {...rest} />;
});
