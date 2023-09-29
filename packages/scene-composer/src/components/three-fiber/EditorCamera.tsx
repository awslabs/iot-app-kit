import * as THREE from 'three';
import React, { Fragment, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Camera, useFrame, useThree } from '@react-three/fiber';
import { MatterportFocusCamera } from '@matterport/r3f/dist';

import useLogger from '../../logger/react-logger/hooks/useLogger';
import {
  Layers,
  ROOT_OBJECT_3D_NAME,
  DEFAULT_ORBIT_CAMERA_CONTROLS_OPTIONS,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_TARGET,
  DEFAULT_TWEEN_DURATION,
} from '../../common/constants';
import { FixedCameraTarget, Vector3 } from '../../interfaces';
import { useTween } from '../../hooks';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useEditorState } from '../../store';
import { CameraControlImpl, TweenValueObject } from '../../store/internalInterfaces';
import useActiveCamera from '../../hooks/useActiveCamera';
import { getSafeBoundingBox } from '../../utils/objectThreeUtils';
import { getMatterportSdk } from '../../common/GlobalSettings';
import { MapControls as MapControlsImpl, OrbitControls as OrbitControlsImpl } from '../../three/OrbitControls';
import { isOrbitOrPanControlImpl } from '../../utils/controlUtils';

import { MapControls, OrbitControls, PointerLockControls } from './controls';

export const EditorMainCamera = forwardRef<Camera>((_, forwardedRef) => {
  const log = useLogger('EditorMainCamera');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const { cameraCommand, cameraControlsType, transformControls, getObject3DBySceneNodeRef, setMainCameraObject } =
    useEditorState(sceneComposerId);
  const matterportSdk = getMatterportSdk(sceneComposerId);
  const scene = useThree((state) => state.scene);
  const setThree = useThree((state) => state.set);
  const makeDefault =
    cameraControlsType === 'orbit' || cameraControlsType === 'pan' || cameraControlsType === 'pointerLock';

  const cameraControlsImplRef = useRef<CameraControlImpl>();
  const cameraRef = useRef<Camera>();
  const [cameraTarget, setCameraTarget] = useState<{
    target?: FixedCameraTarget;
    shouldTween?: boolean;
    object3d?: THREE.Object3D;
  }>();
  const [controlsRemove, setControlsRemove] = useState(false);
  const [setTween, updateTween] = useTween<TweenValueObject>();
  const [mounted, setMounted] = useState(false);

  const activeCamera = useActiveCamera();

  const CameraControls = useMemo(() => {
    // Remove CameraControls while using TransformControls
    if (controlsRemove) {
      return;
    }
    // Otherwise, return CameraControls for the current cameraControlsType. Do nothing for Immersive
    return cameraControlsType === 'orbit'
      ? OrbitControls
      : cameraControlsType === 'pan'
      ? MapControls
      : cameraControlsType === 'pointerLock'
      ? PointerLockControls
      : undefined;
  }, [cameraControlsType, controlsRemove]);

  const handleTransformEvent = useCallback(({ type }) => {
    setControlsRemove(type === 'mouseDown');
  }, []);

  const getCameraTargetByCommand = useMemo(() => {
    return (command: typeof cameraCommand) => {
      log?.verbose('finding camera Object3D target by command', cameraCommand);

      if (command === undefined) return;

      if (typeof command.target !== 'string') {
        if (scene && cameraRef.current) {
          const position = new THREE.Vector3(...command.target.position);
          const direction = new THREE.Vector3(...command.target.target).sub(position).normalize();
          const raycaster = new THREE.Raycaster(position, direction);
          raycaster.camera = cameraRef.current;
          const intersections = raycaster.intersectObjects([scene, ...scene.children]);

          if (intersections.length > 0) {
            return { position: command.target.position, target: intersections[0].point.toArray() } as FixedCameraTarget;
          }
        }
        return command.target;
      }

      const object3d = getObject3DBySceneNodeRef(command.target);
      if (object3d) return findBestViewingPosition(object3d, false, cameraControlsImplRef.current);

      log?.warn('unable to find the correct object in the scene. using the default camera setting.');
    };
  }, [scene]);

  const controlsRef = useCallback((ref) => {
    if (ref) {
      const controls = ref as CameraControlImpl;
      if (controls instanceof OrbitControlsImpl || controls instanceof MapControlsImpl) {
        controls.listenToWindowKeyEvents(window);
      }
      cameraControlsImplRef.current = controls;
      setThree({ controls });
      log?.verbose('setting camera controls', controls);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't update camera target before component is mounted because wrong bounding box will be calaulated.
    if (!mounted) return;

    if (!cameraCommand) {
      // update the camera position to default
      const sceneObject = scene.getObjectByName(ROOT_OBJECT_3D_NAME);
      log?.verbose('setting camera target to root object', cameraCommand);

      setCameraTarget({
        target: sceneObject && findBestViewingPosition(sceneObject, true, cameraControlsImplRef.current),
        shouldTween: true,
        object3d: sceneObject,
      });
    } else {
      log?.verbose('setting camera target by command', cameraCommand);
      const object3d =
        typeof cameraCommand?.target === 'string' ? getObject3DBySceneNodeRef(cameraCommand.target) : undefined;
      if (matterportSdk && object3d) {
        // Don't set target and instead let matterport internally calculate best viewing position based on the object3d
        setCameraTarget({ object3d });
      } else {
        setCameraTarget({
          target: getCameraTargetByCommand(cameraCommand),
          shouldTween: cameraCommand?.mode === 'transition',
          object3d,
        });
      }
    }
  }, [cameraCommand, mounted, matterportSdk]);

  // execute camera command
  useEffect(() => {
    if (cameraRef.current) {
      let position = DEFAULT_CAMERA_POSITION;
      let target = DEFAULT_CAMERA_TARGET;

      if (cameraTarget?.target) {
        ({ position, target } = cameraTarget.target);
      }

      const currentPosition = getTweenValueFromVector3(cameraRef.current.position);
      const duration = cameraTarget?.shouldTween ? DEFAULT_TWEEN_DURATION : 0;

      const tweenConfigs = [
        {
          from: currentPosition,
          to: getTweenValueFromVector3(position),
          onUpdate: () => {
            cameraRef.current &&
              cameraRef.current.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
          },
          duration,
        },
      ];

      const controlRef: OrbitControlsImpl | MapControlsImpl | undefined =
        cameraControlsImplRef.current && isOrbitOrPanControlImpl(cameraControlsImplRef.current)
          ? (cameraControlsImplRef.current as OrbitControlsImpl | MapControlsImpl)
          : undefined;
      const currentTarget = getTweenValueFromVector3(controlRef?.target ?? DEFAULT_CAMERA_TARGET);
      tweenConfigs.push({
        from: currentTarget,
        to: getTweenValueFromVector3(target),
        onUpdate: () => {
          controlRef?.target.set(currentTarget.x, currentTarget.y, currentTarget.z);
        },
        duration,
      });

      log?.verbose('moving camera to target', position, target);

      setTween(...tweenConfigs);
    }
  }, [cameraTarget]);

  // handle mouse events
  useEffect(() => {
    transformControls?.addEventListener('mouseDown', handleTransformEvent);
    transformControls?.addEventListener('mouseUp', handleTransformEvent);

    return () => {
      transformControls?.removeEventListener('mouseDown', handleTransformEvent);
      transformControls?.removeEventListener('mouseUp', handleTransformEvent);
    };
  }, [transformControls]);

  useFrame(() => updateTween());

  useEffect(() => {
    cameraRef.current?.layers.enable(Layers.RenderOnly);
  }, [cameraRef.current]);

  useEffect(() => {
    setMainCameraObject(cameraRef.current);
  }, [cameraRef.current]);

  // TODO: change to useKeyMap hook to get keySettings
  // note current interface uses keyboardevent.code but useKeyMap is using keyboardevent.key
  const keysSetting = useMemo(() => {
    return { LEFT: 'KeyA', UP: 'KeyW', RIGHT: 'KeyD', BOTTOM: 'KeyS' };
  }, []);

  const cameraOptions = useMemo(
    () => ({
      fov: activeCamera.activeCameraSettings.fov,
      far: activeCamera.activeCameraSettings.far,
      near: activeCamera.activeCameraSettings.near,
    }),
    [activeCamera.activeCameraSettings],
  );

  return matterportSdk ? (
    <Fragment>
      <MatterportFocusCamera
        blockNavigation={controlsRemove}
        from={cameraTarget?.target?.position}
        target={cameraTarget?.object3d ? cameraTarget?.object3d : cameraTarget?.target?.target}
        transition={
          cameraTarget?.shouldTween ? matterportSdk.Mode.TransitionType.FLY : matterportSdk.Mode.TransitionType.INSTANT
        }
      />
    </Fragment>
  ) : (
    <Fragment>
      <PerspectiveCamera
        name='MainEditorCamera'
        {...cameraOptions}
        position={DEFAULT_CAMERA_POSITION}
        makeDefault={makeDefault}
        ref={mergeRefs([forwardedRef, cameraRef])}
      />
      {makeDefault &&
        CameraControls &&
        (cameraControlsType === 'orbit' || cameraControlsType === 'pan' ? (
          <CameraControls
            {...DEFAULT_ORBIT_CAMERA_CONTROLS_OPTIONS}
            camera={cameraRef.current}
            target={(cameraControlsImplRef.current as OrbitControlsImpl)?.target}
            makeDefault
            ref={controlsRef}
            keys={keysSetting}
          />
        ) : (
          <CameraControls // as PointerLockControls
            camera={cameraRef.current}
            makeDefault
            ref={controlsRef}
          />
        ))}
    </Fragment>
  );
});

export function findBestViewingPosition(
  object: THREE.Object3D,
  initial: boolean,
  controls?: CameraControlImpl,
): FixedCameraTarget {
  const objectBoundingBox = getSafeBoundingBox(object);
  const size = new THREE.Vector3();
  objectBoundingBox.getSize(size);

  const position = new THREE.Vector3();
  const target = new THREE.Vector3();

  // set target to the bounding box center
  objectBoundingBox.getCenter(target);

  if (
    !!controls &&
    Number.isFinite(objectBoundingBox.max.x) &&
    Number.isFinite(objectBoundingBox.max.y) &&
    Number.isFinite(objectBoundingBox.max.z)
  ) {
    // normal case
    const camera =
      controls instanceof OrbitControlsImpl || controls instanceof MapControlsImpl ? controls.object : controls.camera;
    const currentCameraPosition: THREE.Vector3 = initial ? objectBoundingBox.max : camera.position;
    const distanceToTarget = currentCameraPosition.distanceTo(target);

    const minimumDistance = minimumDistanceByGeometry(size, camera as THREE.PerspectiveCamera);

    if (distanceToTarget >= minimumDistance) {
      position.copy(currentCameraPosition);
    } else {
      const newCameraDirection = new THREE.Vector3();
      newCameraDirection.subVectors(currentCameraPosition, target);
      position.copy(moveDistance(target, newCameraDirection, minimumDistance));
    }
  } else {
    // set the camera to default position if we are unable to calculate one
    position.set(...DEFAULT_CAMERA_POSITION);
    object.getWorldPosition(target);
  }

  return { position: position.toArray(), target: target.toArray() };
}

function getTweenValueFromVector3(vector3: Vector3 | THREE.Vector3): TweenValueObject {
  if (Array.isArray(vector3)) {
    return { x: vector3[0], y: vector3[1], z: vector3[2] };
  } else {
    const { x, y, z } = vector3.clone();
    return { x, y, z };
  }
}

function minimumDistanceByGeometry(size: THREE.Vector3, camera: THREE.PerspectiveCamera) {
  const boundingRadius = size.length() / 2;

  // account for vertical and horizontal fov can differ
  const minFov = Math.min(camera.aspect * camera.fov, camera.fov);

  // triangle of hypotenuse from camera to object center, adjacent to tanget point on circle making 90 angle with
  // opposite that is bounding radius
  // sin(angle) = opposite/hypotenuse => h = o/sin( of 1/2 FOV angle in radians)
  return boundingRadius / Math.sin(0.5 * (Math.PI / 180) * minFov);
}

function moveDistance(start: THREE.Vector3, direction: THREE.Vector3, distance: number) {
  const trajectory = new THREE.Vector3();
  trajectory.copy(direction);
  trajectory.normalize();
  trajectory.multiplyScalar(distance);

  const result = new THREE.Vector3();
  result.addVectors(start, trajectory);
  return result;
}
