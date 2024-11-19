import { act, render } from '@testing-library/react';
import * as THREE from 'three';

import ColorOverlayComponent from '..';
import useMaterialEffect from '../../../../hooks/useMaterialEffect';
import { DefaultAnchorStatus, SceneResourceType } from '../../../../interfaces';
import { accessStore } from '../../../../store';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';
import { getComponentsGroupName } from '../../../../utils/objectThreeUtils';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';

vi.mock('../../../../utils/sceneResourceUtils', async () => {
  const originalModule = await vi.importActual('../../../../utils/sceneResourceUtils');
  return {
    ...originalModule,
    getSceneResourceInfo: vi.fn(),
  };
});

vi.mock('../../../../utils/dataBindingUtils', async () => {
  const originalModule = await vi.importActual('../../../../utils/dataBindingUtils');
  return {
    ...originalModule,
    dataBindingValuesProvider: vi.fn(),
    ruleEvaluator: vi.fn(),
  };
});

vi.mock('../../../../hooks/useMaterialEffect');

describe('ColorOverlayComponent', () => {
  const mockGetSceneRuleMapById = vi.fn();
  const mockGetObject3DBySceneNodeRef = vi.fn();

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
    vi.resetAllMocks();

    (getSceneResourceInfo as vi.Mock).mockReturnValue({
      type: SceneResourceType.Icon,
      value: DefaultAnchorStatus.Info,
    });
    (dataBindingValuesProvider as vi.Mock).mockReturnValue({});
    (ruleEvaluator as vi.Mock).mockReturnValue('info');
  });

  it('should change color', async () => {
    accessStore('default').setState(baseState);
    const transform = vi.fn();
    const restore = vi.fn();
    (useMaterialEffect as vi.Mock).mockImplementation(() => [transform, restore]);

    const { rerender, unmount } = render(<ColorOverlayComponent node={mockNode} component={mockComponent} />);

    const mockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockMesh.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockMesh);
    mockGetObject3DBySceneNodeRef.mockReturnValue(mockObject);
    (getSceneResourceInfo as vi.Mock).mockReturnValue({ type: SceneResourceType.Color, value: 'rgba(100%,0%,0%,2)' });

    act(() => {
      accessStore('default').setState({ ...baseState, dataInput: {} as any });
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
    accessStore('default').setState(baseState);
    const transform = vi.fn();
    const restore = vi.fn();

    const mockPoint = new THREE.Points(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: originalColor }),
    );
    mockPoint.name = getComponentsGroupName(mockNode.ref);
    const mockObject = new THREE.Object3D();
    mockObject.add(mockPoint);

    (useMaterialEffect as vi.Mock).mockImplementation(() => [transform, restore]);
    (ruleEvaluator as vi.Mock).mockImplementation(() => '');

    const { rerender } = render(<ColorOverlayComponent node={mockNode} component={mockComponent} />);

    act(() => {
      accessStore('default').setState({ ...baseState, dataInput: {} as any });
      rerender(<ColorOverlayComponent node={mockNode} component={mockComponent} />);
    });

    expect(transform).not.toBeCalled();
  });
});
