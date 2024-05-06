import * as THREE from 'three';
import { renderHook } from '@testing-library/react-hooks';
import { ThreeEvent } from '@react-three/fiber';

import { AddingWidgetInfo, KnownComponentType } from '../interfaces';
import { ISceneNodeInternal, ISubModelRefComponentInternal, accessStore } from '../../src/store';

import useAddWidget from './useAddWidget';

const appendSceneNodeMock = jest.fn();
const getSceneNodeByRefMock = jest.fn();
const setAddingWidgetMock = jest.fn();

const baseState = {
  appendSceneNode: appendSceneNodeMock,
  getSceneNodeByRef: getSceneNodeByRefMock,
  setAddingWidget: setAddingWidgetMock,
};

describe('useOverwriteRaycaster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a click on object with no parent', () => {
    const node: ISceneNodeInternal = {
      ref: 'nodeRef',
      name: 'nodeName',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: { snapToFloor: false },
      components: [],
      childRefs: [],
      properties: { hiddenWhileImmersive: true },
    };
    const addingWidget: AddingWidgetInfo = {
      node: node,
    };
    accessStore('default').setState({
      ...baseState,
      addingWidget: addingWidget,
      cursorLookAt: new THREE.Vector3(),
    });

    const { handleAddWidget } = renderHook(() => useAddWidget()).result.current;

    const object = new THREE.Object3D();
    const point = new THREE.Vector3();
    const e: ThreeEvent<MouseEvent> = {
      ...new MouseEvent('mocked'),
      eventObject: object,
      intersections: [
        {
          point: point,
          distance: 0,
          eventObject: object,
          object: object,
        },
      ],
      unprojectedPoint: new THREE.Vector3(),
      pointer: new THREE.Vector2(),
      delta: 1,
      ray: new THREE.Ray(),
      camera: new THREE.PerspectiveCamera(),
      stopPropagation: () => {},
      nativeEvent: new MouseEvent('mocked'),
      stopped: false,
      distance: 0,
      point: point,
      object: object,
    };
    handleAddWidget(e);

    expect(setAddingWidgetMock).toBeCalled();
    expect(appendSceneNodeMock).toHaveBeenCalledWith({
      ...addingWidget.node,
      parentRef: undefined,
      transform: {
        position: point.toArray(),
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
    });
  });

  it('should handle a click on object with parents', () => {
    const node: ISceneNodeInternal = {
      ref: 'nodeRef',
      name: 'nodeName',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: { snapToFloor: false },
      components: [],
      childRefs: [],
      properties: { hiddenWhileImmersive: true },
    };
    const addingWidget: AddingWidgetInfo = {
      node: node,
    };
    const subModelComponent: ISubModelRefComponentInternal = {
      ref: 'subRef',
      type: KnownComponentType.SubModelRef,
      selector: 'selector',
    };

    const parentNode: ISceneNodeInternal = {
      ref: 'parentNodeRef',
      name: 'parentNodeName',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: { snapToFloor: false },
      components: [subModelComponent],
      childRefs: [],
      properties: { hiddenWhileImmersive: true },
    };
    getSceneNodeByRefMock.mockReturnValue(parentNode);
    accessStore('default').setState({
      ...baseState,
      addingWidget: addingWidget,
      cursorLookAt: new THREE.Vector3(),
    });

    const { handleAddWidget } = renderHook(() => useAddWidget()).result.current;

    const object = new THREE.Object3D();
    object.userData.nodeRef = 'ref1';

    const parent3D = new THREE.Object3D();
    object.parent = parent3D;
    parent3D.userData.componentTypes = [KnownComponentType.ModelRef];
    parent3D.userData.nodeRef = 'parentRef1';

    const point = new THREE.Vector3();
    const e: ThreeEvent<MouseEvent> = {
      ...new MouseEvent('mocked'),
      eventObject: object,
      intersections: [
        {
          point: point,
          distance: 0,
          eventObject: object,
          object: object,
        },
      ],
      unprojectedPoint: new THREE.Vector3(),
      pointer: new THREE.Vector2(),
      delta: 1,
      ray: new THREE.Ray(),
      camera: new THREE.PerspectiveCamera(),
      stopPropagation: () => {},
      nativeEvent: new MouseEvent('mocked'),
      stopped: false,
      distance: 0,
      point: point,
      object: object,
    };
    handleAddWidget(e);

    expect(setAddingWidgetMock).toBeCalled();
    expect(appendSceneNodeMock).toHaveBeenCalledWith({
      ...addingWidget.node,
      parentRef: object.userData.nodeRef,
      transform: {
        position: parent3D?.worldToLocal(point.clone()).toArray(),
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
    });
  });
});
