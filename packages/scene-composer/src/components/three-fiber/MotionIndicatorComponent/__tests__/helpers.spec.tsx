import React from 'react';
import { act, render } from '@testing-library/react';
import * as THREE from 'three';
import { useFrame as mockUseFrame, useLoader as mockUseLoader } from '@react-three/fiber';

import { getWorldMatrixScale, getNumOfRepeatInX, useArrowTexture } from '../helpers';
import { Component } from '../../../../models/SceneModels';

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useFrame: jest.fn(),
    useLoader: jest.fn(),
  };
});

describe('MotionIndicator helpers', () => {
  const mockGetElapsedTime = jest.fn();
  const mockState = {
    clock: { getElapsedTime: mockGetElapsedTime },
  };

  const setup = () => {
    jest.resetAllMocks();

    (mockUseFrame as jest.Mock).mockImplementation((cb) => cb(mockState));
  };

  beforeEach(() => {
    setup();
  });

  describe('useArrowTexture', () => {
    const baseProps: any = { scale: [1, 2, 3], numOfRepeatInY: 5, speed: 6, objRef: {} };
    let textureRef;

    function TestComponent(props) {
      textureRef = useArrowTexture(props) as any;
      return <div></div>;
    }

    beforeEach(() => {
      setup();
      textureRef = undefined;
    });

    it('should initialize texture parameters', async () => {
      const mockTexture: any = { offset: { x: 0 }, repeat: { x: 1, y: 1, setX: jest.fn(), setY: jest.fn() } };
      (mockUseLoader as unknown as jest.Mock).mockReturnValue({ clone: () => mockTexture });
      act(() => {
        render(<TestComponent {...baseProps} />);
      });

      expect(textureRef.current).toBe(mockTexture);
      expect(textureRef.current.needsUpdate).toBeTruthy();
    });

    it('should update texture offset correctly after useFrame', async () => {
      const mockTexture: any = { offset: { x: 0 }, repeat: { x: 1, y: 1, setX: jest.fn(), setY: jest.fn() } };
      (mockUseLoader as unknown as jest.Mock).mockReturnValue({ clone: () => mockTexture });

      const mockDecompose = jest.fn().mockImplementation((_, __, scale) => {
        scale.set(...baseProps.scale);
      });

      mockGetElapsedTime.mockReturnValue(2);
      act(() => {
        render(
          <TestComponent {...baseProps} objRef={{ current: { matrixWorld: { decompose: mockDecompose } } }} />,
        ).rerender(<TestComponent {...baseProps} />);
      });

      expect(textureRef.current.offset.x).toEqual((-6 * 2 * 1) / 1);
    });

    it('should set correct texture repeat values', async () => {
      const mockTexture: any = { offset: { x: 0 }, repeat: { x: 1, y: 1, setX: jest.fn(), setY: jest.fn() } };
      (mockUseLoader as unknown as jest.Mock).mockReturnValue({ clone: () => mockTexture });
      act(() => {
        render(<TestComponent {...baseProps} />);
      });

      expect(mockTexture.repeat.setX).toBeCalledTimes(2);
      expect(mockTexture.repeat.setX).toBeCalledWith(5); // default return case of getNumOfRepeatInX()
      expect(mockTexture.repeat.setY).toBeCalledTimes(1);
      expect(mockTexture.repeat.setY).toBeCalledWith(5);
    });
  });

  describe('getNumOfRepeatInX', () => {
    const mockScale = [1, 2, 3];
    it('should return correct value for LinearPlane', () => {
      const result = getNumOfRepeatInX(2, mockScale as any, Component.MotionIndicatorShape.LinearPlane);
      expect(result).toEqual(2 / 3);
    });

    it('should return correct value for LinearCylinder', () => {
      const result = getNumOfRepeatInX(2, mockScale as any, Component.MotionIndicatorShape.LinearCylinder);
      expect(result).toEqual(2 / (2 * Math.PI * Math.sqrt((1 + 9 / 4) / 2)));
    });

    it('should return correct value for CircularCylinder', () => {
      const result1 = getNumOfRepeatInX(2, mockScale as any, Component.MotionIndicatorShape.CircularCylinder);
      expect(result1).toEqual(Math.round((2 * Math.PI * Math.sqrt((1 / 4 + 9 / 4) / 2) * 2) / 2));

      const result2 = getNumOfRepeatInX(2, [1, 10, 1], Component.MotionIndicatorShape.CircularCylinder);
      expect(result2).toEqual(1);
    });

    it('should return correct value for unknown shape', () => {
      const result = getNumOfRepeatInX(2, mockScale as any, 'abc' as any);
      expect(result).toEqual(2);
    });
  });

  describe('getWorldMatrixScale', () => {
    const mockScale = [1, 1, 1];
    const mockDecompose = jest.fn();
    const mockObj = { matrixWorld: { decompose: mockDecompose } } as any as THREE.Object3D;

    beforeEach(() => {
      mockDecompose.mockImplementation((_, __, scale) => {
        scale.set(...[2, 3, -4]);
      });
    });

    it('should return correct calculated world matrix scale for LinearPlane', () => {
      const result = getWorldMatrixScale(Component.MotionIndicatorShape.LinearPlane, mockScale as any, mockObj);

      expect(result).toEqual([2, 1, 3]);
      expect(mockDecompose).toBeCalledTimes(1);
    });

    it('should return correct calculated world matrix scale for LinearCylinder', () => {
      const result = getWorldMatrixScale(Component.MotionIndicatorShape.LinearCylinder, mockScale as any, mockObj);

      expect(result).toEqual([3, 2, 4]);
      expect(mockDecompose).toBeCalledTimes(1);
    });

    it('should return default scale when localToWorld not defined', () => {
      const result = getWorldMatrixScale(Component.MotionIndicatorShape.LinearCylinder, mockScale as any);
      expect(result).toEqual(mockScale);
    });
  });
});
