import React from 'react';
import renderer from 'react-test-renderer';
import * as THREE from 'three';

import { MotionIndicatorMeshMaterial, onBeforeCompile } from '../MotionIndicatorMeshMaterial';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

describe('MotionIndicatorMeshMaterial', () => {
  const createComponent = (overrides?) => {
    return (
      <MotionIndicatorMeshMaterial
        backgroundColorOpacity={0.6}
        foregroundColor={new THREE.Color('blue')}
        {...overrides}
      />
    );
  };

  it('should render correctly', async () => {
    // transparent background
    const container = renderer.create(createComponent());
    expect(container).toMatchSnapshot();

    // colored background with opacity
    container.update(createComponent({ foregroundColor: undefined, backgroundColor: new THREE.Color('red') }));
    expect(container).toMatchSnapshot();
  });

  it('should set correct values for uniforms in shader', async () => {
    const getMockShaderRef: any = () => ({
      current: {
        uniforms: {},
        fragmentShader: 'mock-shader',
      },
    });

    let shaderRef = getMockShaderRef();
    onBeforeCompile(shaderRef, 'red' as any, 'blue' as any);

    expect(shaderRef.current.uniforms.backgroundColor.value).toEqual('blue');
    expect(shaderRef.current.uniforms.changeBackground.value).toBeFalsy();
    expect(shaderRef.current.fragmentShader).not.toEqual('mock-shader');

    shaderRef = getMockShaderRef();
    onBeforeCompile(shaderRef, undefined, 'blue' as any);

    expect(shaderRef.current.uniforms.backgroundColor.value).toEqual('blue');
    expect(shaderRef.current.uniforms.changeBackground.value).toBeTruthy();
    expect(shaderRef.current.fragmentShader).not.toEqual('mock-shader');
  });
});
