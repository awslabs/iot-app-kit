import React from 'react';
import { act, render } from '@testing-library/react';
import * as THREE from 'three';

import ColorOverlayComponent from '..';
import { useStore } from '../../../../store';
import { getComponentsGroupName } from '../../../../utils/objectThreeUtils';
import { DefaultAnchorStatus, SceneResourceType } from '../../../../interfaces';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';
import useMaterialEffect from '../../../../hooks/useMaterialEffect';

jest.mock('../../../../utils/sceneResourceUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: jest.fn(),
  };
});

jest.mock('../../../../utils/dataBindingUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: jest.fn(),
    ruleEvaluator: jest.fn(),
  };
});

jest.mock('../../../../hooks/useMaterialEffect');

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

    (getSceneResourceInfo as jest.Mock).mockReturnValue({
      type: SceneResourceType.Icon,
      value: DefaultAnchorStatus.Info,
    });
    (dataBindingValuesProvider as jest.Mock).mockReturnValue({});
    (ruleEvaluator as jest.Mock).mockReturnValue('info');
  });

  const createComponent = (overrides?) => {
    return <ColorOverlayComponent node={mockNode} component={mockComponent} {...overrides} />;
  };

  it('should change color', async () => {
    useStore('default').setState(baseState);
    const transform = jest.fn();
    const restore = jest.fn();
    (useMaterialEffect as jest.Mock).mockImplementation(() => [transform, restore]);

    const { rerender, unmount } = render(<ColorOverlayComponent node={mockNode} component={mockComponent} />);

    const mockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockMesh.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockMesh);
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);
    (getSceneResourceInfo as jest.Mock).mockReturnValue({ type: SceneResourceType.Color, value: 'rgba(100%,0%,0%,2)' });

    act(() => {
      useStore('default').setState({ ...baseState, dataInput: {} as any });
      rerender(<ColorOverlayComponent node={mockNode} component={mockComponent} />);
    });

    expect(transform).toBeCalled();

    // unmount change to original color
    act(() => {
      unmount();
    });

    expect(restore).toBeCalled();
  });

  it('should not change color when there is no mesh', async () => {
    useStore('default').setState(baseState);
    const transform = jest.fn();
    const restore = jest.fn();

    const mockPoint = new THREE.Points(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockPoint.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockPoint);

    (useMaterialEffect as jest.Mock).mockImplementation(() => [transform, restore]);
    (ruleEvaluator as jest.Mock).mockImplementation(() => '');

    const { rerender } = render(<ColorOverlayComponent node={mockNode} component={mockComponent} />);

    act(() => {
      useStore('default').setState({ ...baseState, dataInput: {} as any });
      rerender(<ColorOverlayComponent node={mockNode} component={mockComponent} />);
    });

    expect(transform).not.toBeCalled();
  });
});
