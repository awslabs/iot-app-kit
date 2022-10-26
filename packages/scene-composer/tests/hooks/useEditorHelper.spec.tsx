import React from 'react';
import { Object3D } from 'three';
import { unmountComponentAtNode, render } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { useEditorHelper as UseEditorHelper } from '../../src/hooks/useEditorHelper';
import { useStore } from '../../src/store';

let container = null;
let helper = null;

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    __esModule: true,
    ...originalModule,
    useFrame: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement('div') as any;
  document.body.appendChild(container as any);
});

afterEach(() => {
  unmountComponentAtNode(container as any);
  (container as any).remove();
  container = null;
});

const object3D = new Object3D();
object3D.add = jest.fn();
object3D.remove = jest.fn();
const mutableRefObj = {
  current: object3D,
};

class HelperType extends Object3D {}

interface TestComponentPros {
  isEditing: boolean;
  sceneComposerId: string;
}

function TestComponent(props: TestComponentPros) {
  helper = UseEditorHelper(props.isEditing, props.sceneComposerId, mutableRefObj, HelperType) as any;
  return <div></div>;
}

describe('return correct editor helper.', () => {
  it('useEditorHelper hooks run correctly when isEditing true.', async () => {
    act(() => {
      render(<TestComponent isEditing={true} sceneComposerId='sceneComposerId' />, container);
    });
    expect(object3D.add).toBeCalledTimes(1);

    act(() => {
      unmountComponentAtNode(container as any);
    });

    expect(object3D.remove).toBeCalledTimes(1);
    useStore('sceneComposerId').setState({});
    expect((helper as any).current.visible).toBe(true);
  });

  it('useEditorHelper hooks run correctly when isEditing false.', async () => {
    act(() => {
      render(<TestComponent isEditing={false} sceneComposerId='sceneComposerId' />, container);
    });
    expect(object3D.add).toBeCalledTimes(0);
    unmountComponentAtNode(container as any);
    expect(object3D.remove).toBeCalledTimes(0);
    expect((helper as any).current).toBe(undefined);
    useStore('sceneComposerId').setState({});
    expect((helper as any).current).toBe(undefined);
  });
});
