/* eslint-disable */

import * as THREE from 'three';
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

const mockUseTiles = jest.fn();
jest.doMock('../TilesLoader', () => {
  const originalModule = jest.requireActual('../TilesLoader');
  return {
    ...originalModule,
    useTiles: mockUseTiles,
  };
});

import { TilesModelComponent } from '../TilesModelComponent';
import { KnownComponentType } from '../../../../interfaces';
import { IModelRefComponentInternal } from '../../../../store/internalInterfaces';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

/* eslint-enable */

describe('TilesModelComponent', () => {
  const baseNode: any = {
    ref: 'mock-node',
  };
  const baseComponent: IModelRefComponentInternal = {
    ref: 'mock-comp',
    type: KnownComponentType.ModelRef,
    uri: 'mock/uri',
    modelType: 'Tiles3D',
  };
  const mockObject = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  mockObject.name = 'mockObject';
  const baseScene = new THREE.Group();
  baseScene.add(mockObject);

  const setup = () => {
    jest.resetAllMocks();
  };

  beforeEach(() => {
    setup();
  });

  it('should render TilesModelComponent', async () => {
    const mockUpdate = jest.fn();
    mockUseTiles.mockReturnValue({ update: mockUpdate, group: baseScene });

    const rendered = await ReactThreeTestRenderer.create(
      <TilesModelComponent node={baseNode} component={baseComponent} />,
    );

    const responseScene = rendered.scene.children[0].instance.children[0];
    expect(responseScene.children[0].uuid).toEqual(baseScene.children[0].uuid);
    expect(responseScene.children[0].name).toEqual(baseScene.children[0].name);
    expect((responseScene.children[0] as THREE.Mesh).geometry).toEqual((baseScene.children[0] as THREE.Mesh).geometry);
  });
});
