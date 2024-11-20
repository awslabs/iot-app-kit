import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { useTween as UseTween } from '../../src/hooks/useTween';

let container = null;
let setTween = null;
let updateTween = null;

const mockedTween = {
  to: vi.fn(),
  easing: vi.fn(),
  interpolation: vi.fn(),
  onComplete: vi.fn(),
  onUpdate: vi.fn(),
  start: vi.fn(),
};

const mockedUpdate = {
  update: vi.fn(),
  removeAll: vi.fn(),
};

vi.mock('@tweenjs/tween.js', async () => {
  const originalModule = await vi.importActual('@tweenjs/tween.js');
  return {
    __esModule: true,
    ...originalModule,
    Tween: vi.fn(() => mockedTween),
    Group: vi.fn(() => mockedUpdate),
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

function TestComponent() {
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
      onUpdate: vi.fn(),
      duration: 100,
      easing: vi.fn(),
      interpolation: vi.fn(),
      onComplete: vi.fn(),
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
