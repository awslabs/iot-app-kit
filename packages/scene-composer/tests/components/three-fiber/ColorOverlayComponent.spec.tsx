/* eslint-disable */
import React from 'react';
import { act, render } from '@testing-library/react';

const mockGetSceneResourceInfo = jest.fn();
jest.doMock('../../../src/utils/sceneResourceUtils', () => {
  const originalModule = jest.requireActual('../../../src/utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: mockGetSceneResourceInfo,
  };
});

const mockDataBindingValuesProvider = jest.fn();
const mockRuleEvaluator = jest.fn();
jest.doMock('../../../src/utils/dataBindingUtils', () => {
  const originalModule = jest.requireActual('../../../src/utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: mockDataBindingValuesProvider,
    ruleEvaluator: mockRuleEvaluator,
  };
});

import { ColorOverlayComponent } from '../../../src/components/three-fiber/ColorOverlayComponent';
import { useStore } from '../../../src/store';
import * as THREE from 'three';
import { getComponentsGroupName } from '../../../src/utils/objectThreeUtils';
import { DefaultAnchorStatus, SceneResourceType } from '../../../src/interfaces';

/* eslint-enable */

describe('ColorOverlayComponent', () => {
  const mockGetSceneRuleMapById = jest.fn();
  const mockGetObject3DBySceneNodeRef = jest.fn();

  const baseState = {
    getSceneRuleMapById: mockGetSceneRuleMapById,
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
    dataInput: undefined,
  };

  const mockNode: any = { ref: 'node-ref' };
  const mockComponent: any = {
    ruleBasedMapId: 'rule-1',
    valueDataBinding: {
      dataBindingContext: {},
    },
  };
  const originalColor = 0xffff00;

  beforeEach(() => {
    jest.resetAllMocks();

    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Icon, value: DefaultAnchorStatus.Info });
    mockDataBindingValuesProvider.mockReturnValue({});
    mockRuleEvaluator.mockReturnValue('info');
  });

  const createComponent = (overrides?) => {
    return <ColorOverlayComponent node={mockNode} component={mockComponent} {...overrides} />;
  };

  it('should change color', async () => {
    useStore('default').setState(baseState);
    const renderer = render(createComponent());

    const mockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockMesh.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockMesh);
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);
    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Color, value: 'rgba(100%,0%,0%,2)' });

    act(() => {
      useStore('default').setState({ ...baseState, dataInput: {} as any });
      renderer.rerender(createComponent());
    });

    expect(mockMesh.material.transparent).toBeTruthy();
    expect(mockMesh.material.opacity).toEqual('2');
    expect(mockMesh.material.color).toEqual(new THREE.Color('rgba(100%,0%,0%,2)').clone().convertSRGBToLinear());

    // unmount change to original color
    act(() => {
      renderer.unmount();
    });

    expect(mockMesh.material.transparent).toBeFalsy();
    expect(mockMesh.material.opacity).toEqual(1);
    expect(mockMesh.material.color).toEqual(new THREE.Color(originalColor));
  });

  it('should not change color when there is no mesh', async () => {
    useStore('default').setState(baseState);
    const mockPoint = new THREE.Points(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockPoint.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockPoint);

    const renderer = render(createComponent());

    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);
    mockGetSceneResourceInfo.mockReturnValue({ type: SceneResourceType.Color, value: 'rgba(100%,0%,0%,2)' });

    mockGetSceneResourceInfo.mockClear();
    act(() => {
      useStore('default').setState({ ...baseState, dataInput: {} as any });
      renderer.rerender(createComponent());
    });

    expect(mockPoint.material.transparent).toBeFalsy();
    expect(mockPoint.material.opacity).toEqual(1);
    expect(mockPoint.material.color).toEqual(new THREE.Color(originalColor));
  });
});
