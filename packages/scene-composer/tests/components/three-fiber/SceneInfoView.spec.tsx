import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { BoxGeometry, Mesh, MeshBasicMaterial, Sphere, SphereGeometry, Vector3 } from 'three';

import { SceneInfoView } from '../../../src/components/three-fiber/SceneInfoView';
import { useStore } from '../../../src/store';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

const mockMapping = {
  obj1: new Mesh(new BoxGeometry(), new MeshBasicMaterial()),
  obj2: new Mesh(new SphereGeometry(10), new MeshBasicMaterial()),
};

describe('SceneInfoView', () => {
  it('renders correctly and respond to store updates', async () => {
    useStore('default').setState({
      sceneNodeRefObject3DMapping: {
        getMapping: () => {
          return mockMapping;
        },
      } as any,
    });

    await ReactThreeTestRenderer.create(<SceneInfoView />);

    await ReactThreeTestRenderer.act(async () => {
      useStore('default').getState().appendSceneNode({
        name: 'test',
      });

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, 1000),
      );
      const node = Object.values(useStore('default').getState().document.nodeMap)[0];
      expect(node.name).toEqual('test');
    });
  });
});
