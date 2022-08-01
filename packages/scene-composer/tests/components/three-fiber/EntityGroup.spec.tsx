/* eslint-disable */
import React from 'react';
import renderer from 'react-test-renderer';

const createMockComponent = (testId: string, props: any[]) => {
  return <div data-testid={testId}>{JSON.stringify(props)}</div>;
};
jest.doMock('../../../src/components/three-fiber/AnchorComponent', () => {
  return {
    AnchorComponent: (...props) => createMockComponent('AnchorComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/GLTFModelComponent', () => {
  return {
    GLTFModelComponent: (...props) => createMockComponent('GLTFModelComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/CameraComponent', () => {
  return {
    CameraComponent: (...props) => createMockComponent('CameraComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/LightComponent', () => {
  return {
    LightComponent: (...props) => createMockComponent('LightComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/ColorOverlayComponent', () => {
  return {
    ColorOverlayComponent: (...props) => createMockComponent('ColorOverlayComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/motion-indicator/MotionIndicatorComponent', () => {
  return {
    MotionIndicatorComponent: (...props) => createMockComponent('MotionIndicatorComponent', props),
  };
});
jest.doMock('../../../src/components/three-fiber/ViewpointComponent', () => {
  return {
    ViewpointComponent: (...props) => createMockComponent('ViewpointComponent', props),
  };
});

import { useStore } from '../../../src/store';
import EntityGroup, { getPointerEventHandler } from '../../../src/components/three-fiber/EntityGroup';
import { KnownComponentType } from '../../../src';
import { CameraType, LightType } from '../../../src/models/SceneModels';
import { Color, Object3D } from 'three';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

/* eslint-enable */

describe('EntityGroup', () => {
  describe('EntityGroup component', () => {
    const mockGetObject3DBySceneNodeRef = jest.fn();
    const mockSetSceneNodeObject3DMapping = jest.fn();
    const mockSetSelectedSceneNodeRef = jest.fn();
    const mockGetSceneNodeByRef = jest.fn();

    const baseState: any = {
      getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
      selectedSceneNodeRef: 'selected-ref',
      setSceneNodeObject3DMapping: mockSetSceneNodeObject3DMapping,
      setSelectedSceneNodeRef: mockSetSelectedSceneNodeRef,
      getSceneNodeByRef: mockGetSceneNodeByRef,
    };
    const components: { [type in KnownComponentType]: any } = {
      [KnownComponentType.ModelRef]: {
        ref: 'mock-comp',
        type: KnownComponentType.ModelRef,
        uri: 'mock/uri',
        modelType: 'GLB',
      },
      [KnownComponentType.Camera]: {
        ref: 'mock-comp',
        type: KnownComponentType.Camera,
        cameraType: CameraType.Orthographic,
        near: 2,
        far: 4,
      },
      [KnownComponentType.Light]: {
        ref: 'mock-comp',
        type: KnownComponentType.Light,
        lightType: LightType.Directional,
        lightSettings: {
          color: new Color('red'),
          intensity: 3,
          castShadow: true,
        },
      },
      [KnownComponentType.ModelShader]: {
        ref: 'mock-comp',
        type: KnownComponentType.ModelShader,
        valueDataBinding: {
          dataBindingContext: { a: 'abc' },
        },
      },
      [KnownComponentType.Tag]: {
        ref: 'mock-comp',
        type: KnownComponentType.Tag,
        valueDataBinding: {
          dataBindingContext: { a: 'abc' },
        },
      },
      [KnownComponentType.MotionIndicator]: {
        ref: 'mock-comp',
        type: KnownComponentType.MotionIndicator,
        shape: 'LinearPlane',
        valueDataBindings: {},
        config: {
          numOfRepeatInY: 2,
          backgroundColorOpacity: 1,
        },
      },
      [KnownComponentType.Viewpoint]: {
        ref: 'mock-comp',
        type: KnownComponentType.Viewpoint,
        skyboxImages: ['mockedImage.jpg'],
        cameraPosition: [0, 0, 0],
        skyboxImageFormat: 'SixSided',
      },
    };
    const baseNode: any = {
      ref: 'mock-node',
      transform: { position: [1, 1, 1], rotation: [2, 2, 2], scale: [3, 3, 3] },
      properties: {},
    };

    const setup = () => {
      jest.resetAllMocks();
    };

    beforeEach(() => {
      setup();
    });

    it('should render different component views', () => {
      const test = (type: string) => {
        useStore('default').setState(baseState);
        const comp = components[type] || {};
        const node = {
          ...baseNode,
          components: [comp],
        };
        const rendered = renderer.create(<EntityGroup node={node} />);

        expect(rendered).toMatchSnapshot();
      };

      Object.values(KnownComponentType).forEach((type) => test(type));

      test('random');
    });

    it('should not render motion indicator when it is not visible', () => {
      useStore('default').setState({ ...baseState, noHistoryStates: { motionIndicatorVisible: false } });
      const comp = components[KnownComponentType.MotionIndicator];
      const node = {
        ...baseNode,
        components: [comp],
      };
      const rendered = renderer.create(<EntityGroup node={node} />);

      expect(rendered).toMatchSnapshot();
    });

    it('should render child views', async () => {
      useStore('default').setState(baseState);
      const comp = components[KnownComponentType.Tag];
      const node = {
        ...baseNode,
        childRefs: ['mock-child-tag-node'],
        components: [comp],
      };
      const childComp = {
        ...comp,
        ref: 'mock-child-tag-comp',
        type: KnownComponentType.Tag,
      };
      const childNode = {
        ...baseNode,
        ref: 'mock-child-tag-node',
        components: [childComp],
      };
      mockGetSceneNodeByRef.mockReturnValue(childNode);

      const rendered = await renderer.create(<EntityGroup node={node} />);

      expect(rendered).toMatchSnapshot();
    });

    it('should set correct objecct 3D ref', () => {
      const mockObj3D = new Object3D();
      useStore('default').setState(baseState);
      renderer.create(<EntityGroup node={baseNode} />, {
        createNodeMock: (_) => {
          return mockObj3D;
        },
      });

      expect(mockSetSceneNodeObject3DMapping).toBeCalledWith(baseNode.ref, mockObj3D);
    });
  });

  describe('getPointerEventHandler', () => {
    const mockSetSelectedSceneNodeRef = jest.fn();
    const mockStopPropagation = jest.fn();
    const mockEventBase: any = {
      stopPropagation: mockStopPropagation,
      type: 'pointerup',
      clientX: 111,
      clientY: 222,
    };
    const comp = {
      ref: 'mock-comp',
      type: KnownComponentType.Tag,
    };
    const baseNode: any = {
      ref: 'mock-node',
      components: [comp],
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should set correct lastPointerDownLocation for pointerdown event', () => {
      const location: any = {};
      getPointerEventHandler(
        location,
        baseNode,
        mockSetSelectedSceneNodeRef,
      )({ ...mockEventBase, type: 'pointerdown' });

      expect(location.current).toEqual([mockEventBase.clientX, mockEventBase.clientY]);
    });

    it('should set selected node ref for valid pointerup event', () => {
      const location: any = { current: [mockEventBase.clientX, mockEventBase.clientY] };
      getPointerEventHandler(location, baseNode, mockSetSelectedSceneNodeRef)(mockEventBase);

      expect(mockStopPropagation).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).toBeCalledWith(baseNode.ref);
      expect(location.current).toBeNull();
    });

    it('should de-selecte node ref for valid pointerup event', () => {
      const location: any = { current: [mockEventBase.clientX, mockEventBase.clientY] };
      getPointerEventHandler(location, baseNode, mockSetSelectedSceneNodeRef, baseNode.ref)(mockEventBase);

      expect(mockStopPropagation).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).toBeCalledWith(undefined);
      expect(location.current).toBeNull();
    });

    it('should not set selected node ref when the last down location is undefined', () => {
      const location: any = {};
      getPointerEventHandler(location, baseNode, mockSetSelectedSceneNodeRef)(mockEventBase);

      expect(mockStopPropagation).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).not.toBeCalled();
    });

    it('should not set selected node ref when the last down location is far away from the pointerup event location', () => {
      const location: any = { current: [0, 0] };
      getPointerEventHandler(location, baseNode, mockSetSelectedSceneNodeRef)(mockEventBase);

      expect(mockStopPropagation).toBeCalledTimes(1);
      expect(mockSetSelectedSceneNodeRef).not.toBeCalled();
      expect(location.current).toBeNull();
    });
  });
});
