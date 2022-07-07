import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { useTween as UseTween } from '../../src/hooks/useTween';

let container = null;
let setTween = null;
let updateTween = null;

const mockedTween = {
  to: jest.fn(),
  easing: jest.fn(),
  interpolation: jest.fn(),
  onComplete: jest.fn(),
  onUpdate: jest.fn(),
  start: jest.fn(),
};

const mockedUpdate = {
  update: jest.fn(),
  removeAll: jest.fn(),
};

jest.mock('@tweenjs/tween.js', () => {
  const originalModule = jest.requireActual('@tweenjs/tween.js');
  return {
    __esModule: true,
    ...originalModule,
    Tween: jest.fn(() => mockedTween),
    Group: jest.fn(() => mockedUpdate),
  };
});

beforeEach(() => {
  container = document.createElement('div') as any;
  document.body.appendChild(container as any);
});

afterEach(() => {
  unmountComponentAtNode(container as any);
  (container as any).remove();
  container = null;
});

function TestComponent(props) {
  [setTween, updateTween] = UseTween() as any;
  return <div></div>;
}

describe('useTween returns correct functions', () => {
  it('setTween behaves correctly.', async () => {
    act(() => {
      render(<TestComponent />, container);
    });

    const configs = {
      from: {},
      to: {},
      onUpdate: jest.fn(),
      duration: 100,
      easing: jest.fn(),
      interpolation: jest.fn(),
      onComplete: jest.fn(),
    };

    (setTween as any)(configs);
    expect(mockedTween.to).toBeCalledTimes(1);
    expect(mockedTween.easing).toBeCalledTimes(1);
    expect(mockedTween.interpolation).toBeCalledTimes(1);
    expect(mockedTween.onComplete).toBeCalledTimes(1);
    expect(mockedTween.onUpdate).toBeCalledTimes(1);
    expect(mockedTween.start).toBeCalledTimes(1);
  });

  it('updateTween behaves correctly.', async () => {
    act(() => {
      render(<TestComponent />, container);
    });

    (updateTween as any)();
    expect(mockedUpdate.update).toBeCalledTimes(1);
  });
});
