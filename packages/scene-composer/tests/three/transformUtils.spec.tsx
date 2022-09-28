import React, { useEffect, useState } from 'react';
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { render } from '@testing-library/react';

import { ISceneNodeInternal } from '../../src/store';
import { snapObjectToFloor, useSnapObjectToFloor } from '../../src/three/transformUtils';
import { Vector3 } from '../../src';

const getObject3DBySceneNodeRef = jest.fn();

jest.mock('../../src/store', () => {
  return {
    useEditorState: jest.fn(() => {
      return { getObject3DBySceneNodeRef };
    }),
  };
});

describe('snapObjectToFloor', () => {
  let componentMesh;
  let childComponent;
  let obj;
  let parentObj;

  beforeEach(() => {
    componentMesh = new Mesh();
    childComponent = new Object3D();
    obj = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
    parentObj = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
  });

  describe('box with position [0,0,0] and size [1,1,1]', () => {
    describe('an undefined parent', () => {
      it('calculates floor position to be [0, 0.5, 0]', () => {
        expect(snapObjectToFloor(obj)).toEqual([0, 0.5, 0]);
      });
    });

    describe('parent box with position [0,0,0] and size [2,2,2]', () => {
      it('calculates floor position to be [0, 0.5, 0]', () => {
        expect(snapObjectToFloor(obj, parentObj)).toEqual([0, 0.5, 0]);
      });
    });
  });

  describe('box with position [0,10,0] and size [1,1,1]', () => {
    describe('an undefined parent', () => {
      it('calculates floor position to be [0, 0.5, 0]', () => {
        obj.position.set(0, 10, 0);
        expect(snapObjectToFloor(obj)).toEqual([0, 0.5, 0]);
      });
    });

    describe('parent box with position [0,1,0] and size [2,2,2]', () => {
      it('calculates floor position to be [0, 0.5, 0]', () => {
        obj.position.set(0, 10, 0);
        parentObj.position.set(0, 1, 0);
        expect(snapObjectToFloor(obj, parentObj)).toEqual([0, 0.5, 0]);
      });
    });
  });

  describe('useSnapObjectToFloor hook', () => {
    it('should continue to snap to floor after applying this constraint', async () => {
      jest.useFakeTimers();
      childComponent.name = 'name_COMPONENT_test';
      childComponent.add(componentMesh);
      obj.add(childComponent);
      getObject3DBySceneNodeRef.mockImplementation((ref: string) => {
        if (ref === 'ref') {
          return obj;
        } else if (ref === 'parentRef') {
          return parentObj;
        }
      });

      const testNode = { ref: 'ref', parentRef: 'parentRef', transformConstraint: { snapToFloor: true } } as any;
      const validate = jest.fn((floorPosition: Vector3, node: ISceneNodeInternal) => {
        expect(floorPosition).toEqual([0, 0.5, 0]);
        expect(node).toEqual(testNode);
      });

      const DummyComponent = () => {
        const activate = useSnapObjectToFloor(validate, testNode);
        const [isDone, setIsDone] = useState(false);
        useEffect(() => {
          activate();
          setIsDone(true);
        });

        if (isDone) {
          return <div data-testid={'rendered'} />;
        } else {
          return <div />;
        }
      };

      const { findByTestId } = render(<DummyComponent />);

      await findByTestId('rendered');

      jest.runOnlyPendingTimers();

      (componentMesh.onAfterRender as any)();
    });
  });
});
