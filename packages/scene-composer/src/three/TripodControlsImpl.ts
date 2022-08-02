/* eslint-disable */
import {
  Camera,
  EventDispatcher,
  MathUtils,
  MOUSE,
  PerspectiveCamera,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
} from 'three';

// This set of controls performs stationary looking.
// DISCLAIMER: This is a severely trimmed down copy of:
// https://github.com/pmndrs/three-stdlib/blob/main/src/controls/OrbitControls.ts
//
//    Look - left mouse / touch: one-finger move

const moduloWrapAround = (offset: number, capacity: number) => ((offset % capacity) + capacity) % capacity;

export class TripodControlsImpl extends EventDispatcher {
  object: Camera;
  domElement: HTMLElement | undefined;
  // Set to false to disable this control
  enabled = true;
  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  minPolarAngle = 0; // radians
  maxPolarAngle = Math.PI; // radians
  // How far you can orbit horizontally, upper and lower limits.
  // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
  minAzimuthAngle = -Infinity; // radians
  maxAzimuthAngle = Infinity; // radians
  // Set to true to enable damping (inertia)
  // If damping is enabled, you must call controls.update() in your animation loop
  enableDamping = false;
  dampingFactor = 0.05;
  // Set to false to disable rotating
  enableRotate = true;
  rotateSpeed = 10.0;
  reverseOrbit = false; // true if you want to reverse the orbit to mouse drag from left to right = orbits left
  // The four arrow keys
  keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
  // Mouse buttons
  mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.ROTATE,
    RIGHT: MOUSE.ROTATE,
  };
  // Touch fingers
  touches = { ONE: TOUCH.ROTATE };
  position0: Vector3;
  // the target DOM element for key events
  _domElementKeyEvents: any = null;

  getPolarAngle: () => number;
  getAzimuthalAngle: () => number;
  setPolarAngle: (x: number) => void;
  setAzimuthalAngle: (x: number) => void;

  listenToKeyEvents: (domElement: HTMLElement) => void;
  saveState: () => void;
  reset: () => void;
  update: () => void;
  connect: (domElement: HTMLElement) => void;
  dispose: () => void;

  constructor(object: Camera, domElement?: HTMLElement) {
    super();

    this.object = object;
    this.domElement = domElement;

    // for reset
    this.position0 = this.object.position.clone();

    //
    // public methods
    //

    this.getPolarAngle = (): number => spherical.phi;

    this.getAzimuthalAngle = (): number => spherical.theta;

    this.setPolarAngle = (value: number): void => {
      // use modulo wrapping to safeguard value
      let phi = moduloWrapAround(value, 2 * Math.PI);
      let currentPhi = spherical.phi;

      // convert to the equivalent shortest angle
      if (currentPhi < 0) currentPhi += 2 * Math.PI;
      if (phi < 0) phi += 2 * Math.PI;
      let phiDist = Math.abs(phi - currentPhi);
      if (2 * Math.PI - phiDist < phiDist) {
        if (phi < currentPhi) {
          phi += 2 * Math.PI;
        } else {
          currentPhi += 2 * Math.PI;
        }
      }
      sphericalDelta.phi = phi - currentPhi;
      scope.update();
    };

    this.setAzimuthalAngle = (value: number): void => {
      // use modulo wrapping to safeguard value
      let theta = moduloWrapAround(value, 2 * Math.PI);
      let currentTheta = spherical.theta;

      // convert to the equivalent shortest angle
      if (currentTheta < 0) currentTheta += 2 * Math.PI;
      if (theta < 0) theta += 2 * Math.PI;
      let thetaDist = Math.abs(theta - currentTheta);
      if (2 * Math.PI - thetaDist < thetaDist) {
        if (theta < currentTheta) {
          theta += 2 * Math.PI;
        } else {
          currentTheta += 2 * Math.PI;
        }
      }
      sphericalDelta.theta = theta - currentTheta;
      scope.update();
    };

    this.listenToKeyEvents = (domElement: HTMLElement): void => {
      domElement.addEventListener('keydown', onKeyDown);
      this._domElementKeyEvents = domElement;
    };

    this.saveState = (): void => {
      scope.position0.copy(scope.object.position);
    };

    this.reset = (): void => {
      scope.object.position.copy(scope.position0);
      if (scope.object instanceof PerspectiveCamera) {
        scope.object.updateProjectionMatrix();
      }

      scope.dispatchEvent(changeEvent);

      scope.update();

      state = STATE.NONE;
    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = ((): (() => void) => {
      const lastPosition = new Vector3();
      const lastQuaternion = new Quaternion();

      return function update(): boolean {
        const position = scope.object.position;

        //-----------------------------------
        // Lock the latitude below +/-90 degrees
        sphericalDelta.phi = Math.max(-85, Math.min(85, sphericalDelta.phi));

        const phi = MathUtils.degToRad(90 - sphericalDelta.phi);
        const theta = MathUtils.degToRad(sphericalDelta.theta);

        // Move the target position in the angle of rotation from the position of the camera
        const targetPosition = new Vector3().setFromSphericalCoords(1, phi, theta).add(position);
        scope.object.lookAt(targetPosition);
        //----------------------------------

        scale = 1;

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (
          lastPosition.distanceToSquared(scope.object.position) > EPS ||
          8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS
        ) {
          scope.dispatchEvent(changeEvent);

          lastPosition.copy(scope.object.position);
          lastQuaternion.copy(scope.object.quaternion);

          return true;
        }

        return false;
      };
    })();

    // https://github.com/mrdoob/three.js/issues/20575
    this.connect = (domElement: HTMLElement): void => {
      if ((domElement as any) === document) {
        console.error(
          'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.',
        );
      }
      scope.domElement = domElement;
      // disables touch scroll
      // touch-action needs to be defined for pointer events to work on mobile
      // https://stackoverflow.com/a/48254578
      scope.domElement.style.touchAction = 'none';
      scope.domElement.addEventListener('contextmenu', onContextMenu);
      scope.domElement.addEventListener('pointerdown', onPointerDown);
      scope.domElement.addEventListener('pointercancel', onPointerCancel);
    };

    this.dispose = (): void => {
      scope.domElement?.removeEventListener('contextmenu', onContextMenu);
      scope.domElement?.removeEventListener('pointerdown', onPointerDown);
      scope.domElement?.removeEventListener('pointercancel', onPointerCancel);
      scope.domElement?.ownerDocument.removeEventListener('pointermove', onPointerMove);
      scope.domElement?.ownerDocument.removeEventListener('pointerup', onPointerUp);
      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
      }
    };

    //
    // internals
    //

    const scope = this;

    const changeEvent = { type: 'change' };
    const startEvent = { type: 'start' };
    const endEvent = { type: 'end' };

    const STATE = {
      NONE: -1,
      ROTATE: 0,
      TOUCH_ROTATE: 1,
    };

    let state = STATE.NONE;

    const EPS = 0.000001;

    // current position in spherical coordinates
    const spherical = new Spherical();
    const sphericalDelta = new Spherical();

    let scale = 1;

    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();

    const pointers: PointerEvent[] = [];
    const pointerPositions: { [key: string]: Vector2 } = {};

    function rotateLeft(angle: number): void {
      if (scope.reverseOrbit) {
        sphericalDelta.theta += angle;
      } else {
        sphericalDelta.theta -= angle;
      }
    }

    function rotateUp(angle: number): void {
      if (scope.reverseOrbit) {
        sphericalDelta.phi += angle;
      } else {
        sphericalDelta.phi -= angle;
      }
    }

    //
    // event callbacks - update the object state
    //

    function handleMouseDownRotate(event: MouseEvent) {
      rotateStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveRotate(event: MouseEvent) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      if (element) {
        rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height
        rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);
      }
      rotateStart.copy(rotateEnd);
      scope.update();
    }

    function handleKeyDown(event: KeyboardEvent) {
      let needsUpdate = false;

      switch (event.code) {
        case scope.keys.UP:
          rotateUp(scope.rotateSpeed);
          needsUpdate = true;
          break;

        case scope.keys.BOTTOM:
          rotateUp(-scope.rotateSpeed);
          needsUpdate = true;
          break;

        case scope.keys.LEFT:
          rotateLeft(scope.rotateSpeed);
          needsUpdate = true;
          break;

        case scope.keys.RIGHT:
          rotateLeft(-scope.rotateSpeed);
          needsUpdate = true;
          break;
      }

      if (needsUpdate) {
        // prevent the browser from scrolling on cursor keys
        event.preventDefault();
        scope.update();
      }
    }

    function handleTouchStartRotate() {
      if (pointers.length == 1) {
        rotateStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);

        rotateStart.set(x, y);
      }
    }

    function handleTouchMoveRotate(event: PointerEvent) {
      if (pointers.length == 1) {
        rotateEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);
        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);
        rotateEnd.set(x, y);
      }

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      if (element) {
        rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height
        rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);
      }
      rotateStart.copy(rotateEnd);
    }

    //
    // event handlers - FSM: listen for events and reset state
    //

    function onPointerDown(event: PointerEvent) {
      if (!scope.enabled) return;

      if (pointers.length === 0) {
        scope.domElement?.ownerDocument.addEventListener('pointermove', onPointerMove);
        scope.domElement?.ownerDocument.addEventListener('pointerup', onPointerUp);
      }

      addPointer(event);

      if (event.pointerType === 'touch') {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (!scope.enabled) return;

      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }

    function onPointerUp(event: PointerEvent) {
      removePointer(event);

      if (pointers.length === 0) {
        scope.domElement?.releasePointerCapture(event.pointerId);

        scope.domElement?.ownerDocument.removeEventListener('pointermove', onPointerMove);
        scope.domElement?.ownerDocument.removeEventListener('pointerup', onPointerUp);
      }

      scope.dispatchEvent(endEvent);

      state = STATE.NONE;
    }

    function onPointerCancel(event: PointerEvent) {
      removePointer(event);
    }

    function onMouseDown(event: MouseEvent) {
      let mouseAction;

      switch (event.button) {
        case 0:
          mouseAction = scope.mouseButtons.LEFT;
          break;

        case 1:
          mouseAction = scope.mouseButtons.MIDDLE;
          break;

        case 2:
          mouseAction = scope.mouseButtons.RIGHT;
          break;

        default:
          mouseAction = -1;
      }

      switch (mouseAction) {
        case MOUSE.ROTATE:
          if (!scope.enableRotate) return;
          handleMouseDownRotate(event);
          state = STATE.ROTATE;
          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(startEvent);
      }
    }

    function onMouseMove(event: MouseEvent) {
      if (!scope.enabled) return;

      switch (state) {
        case STATE.ROTATE:
          if (!scope.enableRotate) return;
          handleMouseMoveRotate(event);
          break;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!scope.enabled || !scope.enableRotate) return;
      handleKeyDown(event);
    }

    function onTouchStart(event: PointerEvent) {
      trackPointer(event);

      switch (pointers.length) {
        case 1:
          switch (scope.touches.ONE) {
            case TOUCH.ROTATE:
              if (!scope.enableRotate) return;
              handleTouchStartRotate();
              state = STATE.TOUCH_ROTATE;
              break;

            default:
              state = STATE.NONE;
          }

          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(startEvent);
      }
    }

    function onTouchMove(event: PointerEvent) {
      trackPointer(event);

      switch (state) {
        case STATE.TOUCH_ROTATE:
          if (!scope.enableRotate) return;
          handleTouchMoveRotate(event);
          scope.update();
          break;

        default:
          state = STATE.NONE;
      }
    }

    function onContextMenu(event: Event) {
      if (!scope.enabled) return;
      event.preventDefault();
    }

    function addPointer(event: PointerEvent) {
      pointers.push(event);
    }

    function removePointer(event: PointerEvent) {
      delete pointerPositions[event.pointerId];

      for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].pointerId == event.pointerId) {
          pointers.splice(i, 1);
          return;
        }
      }
    }

    function trackPointer(event: PointerEvent) {
      let position = pointerPositions[event.pointerId];

      if (position === undefined) {
        position = new Vector2();
        pointerPositions[event.pointerId] = position;
      }

      position.set(event.pageX, event.pageY);
    }

    function getSecondPointerPosition(event: PointerEvent) {
      const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
      return pointerPositions[pointer.pointerId];
    }

    // connect events
    if (domElement !== undefined) this.connect(domElement);
    // force an update at start
    this.update();
  }
}
