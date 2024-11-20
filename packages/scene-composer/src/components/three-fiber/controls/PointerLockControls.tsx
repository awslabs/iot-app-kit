/* istanbul ignore file */
import { type EventManager, type ReactThreeFiber, type RootState, useFrame, useThree } from '@react-three/fiber';
import { type DomEvent } from '@react-three/fiber/dist/declarations/src/core/events';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { defaultKeyMap } from '../../../hooks/useKeyMap';
import useKeyPress from '../../../hooks/useKeyPress';
import { PointerLockControls as PointerLockControlsImpl } from '../../../three/PointerLockControls';

export type PointerLockControlsProps = ReactThreeFiber.Object3DNode<
  PointerLockControlsImpl,
  typeof PointerLockControlsImpl
> & {
  domElement?: HTMLElement;
  selector?: string;
  enabled?: boolean;
  camera?: THREE.Camera;
  onChange?: (e?: THREE.Event) => void;
  onLock?: (e?: THREE.Event) => void;
  onUnlock?: (e?: THREE.Event) => void;
  makeDefault?: boolean;
};

export const PointerLockControls = forwardRef<PointerLockControlsImpl, PointerLockControlsProps>(
  ({ domElement, selector, onChange, onLock, onUnlock, enabled = true, makeDefault, ...props }, ref) => {
    const { camera, ...rest } = props;
    const setEvents = useThree((state) => state.setEvents);
    const gl = useThree((state) => state.gl);
    const defaultCamera = useThree((state) => state.camera);
    const invalidate = useThree((state) => state.invalidate);
    const events = useThree((state) => state.events) as EventManager<HTMLElement>;
    const get = useThree((state) => state.get);
    const set = useThree((state) => state.set);
    const explCamera = camera || defaultCamera;
    const explDomElement = (domElement || events.connected || gl.domElement) as HTMLElement;

    const controls = useMemo(() => new PointerLockControlsImpl(explCamera), [explCamera]);

    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const moveUp = useRef(false);
    const moveDown = useRef(false);

    const velocity = useRef(new THREE.Vector3());

    useFrame((_state, delta) => {
      if (enabled && controls.isLocked) {
        const newVelocity = velocity.current;
        newVelocity.x -= velocity.current.x * 10.0 * delta;
        newVelocity.y -= velocity.current.y * 10.0 * delta; //fly not fall
        newVelocity.z -= velocity.current.z * 10.0 * delta;

        const direction = new THREE.Vector3();
        direction.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.y = Number(moveUp.current) - Number(moveDown.current);
        direction.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveLeft.current || moveRight.current) newVelocity.x -= direction.x * 400.0 * delta;
        if (moveUp.current || moveDown.current) newVelocity.y -= direction.y * 400.0 * delta;
        if (moveForward.current || moveBackward.current) newVelocity.z -= direction.z * 400.0 * delta;

        controls.moveRight(-newVelocity.x * delta);
        controls.moveForward(-newVelocity.z * delta);
        controls.moveUp(-newVelocity.y * delta);

        velocity.current = newVelocity;
      }
    });

    const setMoveForward = useCallback((active: boolean) => {
      moveForward.current = active;
    }, []);
    const setMoveBackwards = useCallback((active: boolean) => {
      moveBackward.current = active;
    }, []);
    const setMoveLeft = useCallback((active: boolean) => {
      moveLeft.current = active;
    }, []);
    const setMoveRight = useCallback((active: boolean) => {
      moveRight.current = active;
    }, []);
    const setMoveUp = useCallback((active: boolean) => {
      moveUp.current = active;
    }, []);
    const setMoveDown = useCallback((active: boolean) => {
      moveDown.current = active;
    }, []);

    // These should use useKeyMap once we have a way for users to reset back to default
    // const { key, keymap } = useKeyMap();
    // example of use would be
    // useKeyPress(key('movement', 'forward1'), {enabled, onKeyDown: () => setMoveForward(true), onKeyUp: () => setMoveForward(false)});

    useKeyPress(defaultKeyMap['movement']['forward'], {
      enabled,
      onKeyDown: () => setMoveForward(true),
      onKeyUp: () => setMoveForward(false),
    });
    useKeyPress(defaultKeyMap['movement']['forward1'], {
      enabled,
      onKeyDown: () => setMoveForward(true),
      onKeyUp: () => setMoveForward(false),
    });

    useKeyPress(defaultKeyMap['movement']['left'], {
      enabled,
      onKeyDown: () => setMoveLeft(true),
      onKeyUp: () => setMoveLeft(false),
    });
    useKeyPress(defaultKeyMap['movement']['left1'], {
      enabled,
      onKeyDown: () => setMoveLeft(true),
      onKeyUp: () => setMoveLeft(false),
    });

    useKeyPress(defaultKeyMap['movement']['backward'], {
      enabled,
      onKeyDown: () => setMoveBackwards(true),
      onKeyUp: () => setMoveBackwards(false),
    });
    useKeyPress(defaultKeyMap['movement']['backward1'], {
      enabled,
      onKeyDown: () => setMoveBackwards(true),
      onKeyUp: () => setMoveBackwards(false),
    });

    useKeyPress(defaultKeyMap['movement']['right'], {
      enabled,
      onKeyDown: () => setMoveRight(true),
      onKeyUp: () => setMoveRight(false),
    });
    useKeyPress(defaultKeyMap['movement']['right1'], {
      enabled,
      onKeyDown: () => setMoveRight(true),
      onKeyUp: () => setMoveRight(false),
    });

    useKeyPress(defaultKeyMap['movement']['up'], {
      enabled,
      onKeyDown: () => setMoveUp(true),
      onKeyUp: () => setMoveUp(false),
    });

    useKeyPress(defaultKeyMap['movement']['down'], {
      enabled,
      onKeyDown: () => setMoveDown(true),
      onKeyUp: () => setMoveDown(false),
    });

    useEffect(() => {
      if (enabled) {
        controls.connect(explDomElement);

        // Force events to be centered while PLC is active
        const oldComputeOffsets = get().events.compute;
        setEvents({
          compute(_event: DomEvent, state: RootState) {
            const offsetX = state.size.width / 2;
            const offsetY = state.size.height / 2;
            state.pointer.set((offsetX / state.size.width) * 2 - 1, -(offsetY / state.size.height) * 2 + 1);
            state.raycaster.setFromCamera(state.pointer, state.camera);
          },
        });
        return () => {
          controls.disconnect();
          setEvents({ compute: oldComputeOffsets });
        };
      }
    }, [enabled, controls]);

    useEffect(() => {
      const callback = (e: THREE.Event) => {
        invalidate();
        if (onChange) onChange(e);
      };

      controls.addEventListener('change', callback);

      if (onLock) controls.addEventListener('lock', onLock);
      if (onUnlock) controls.addEventListener('unlock', onUnlock);

      // Enforce previous interaction
      const handler = () => controls.lock();
      const elements = selector ? Array.from(document.querySelectorAll(selector)) : [document];
      elements.forEach((element) => element && element.addEventListener('click', handler));

      return () => {
        controls.removeEventListener('change', callback);
        if (onLock) controls.addEventListener('lock', onLock);
        if (onUnlock) controls.addEventListener('unlock', onUnlock);
        elements.forEach((element) => (element ? element.removeEventListener('click', handler) : undefined));
      };
    }, [onChange, onLock, onUnlock, selector, controls, invalidate]);

    useEffect(() => {
      if (makeDefault) {
        const old = get().controls;
        set({ controls });
        return () => set({ controls: old });
      }
    }, [makeDefault, controls]);

    return <primitive ref={ref} object={controls} {...rest} />;
  },
);
