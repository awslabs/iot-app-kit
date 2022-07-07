/* eslint-disable */
const mockUseRef = jest.fn();
const mockUseEffect = jest.fn();
jest.doMock('react', () => {
  const originalModule = jest.requireActual('react');
  return {
    ...originalModule,
    useRef: mockUseRef,
    useEffect: mockUseEffect,
  };
});

const mockTintData = jest.fn();
jest.doMock('react-image-tint/lib/utils.js', () => {
  const originalModule = jest.requireActual('react-image-tint/lib/utils.js');
  return {
    ...originalModule,
    tintData: mockTintData,
  };
});

import React from 'react';
import renderer from 'react-test-renderer';

import { PreviewArrow } from '../../../../../src/components/panels/scene-components/motion-indicator/PreviewArrow';
/* eslint-enable */

describe('PreviewArrow', () => {
  const baseProps = {
    foregroundColor: 'red',
    backgroundColor: 'blue',
    backgroundOpacity: 0.6,
  };
  let prevColor;

  beforeEach(() => {
    jest.clearAllMocks();
    prevColor = undefined;
    const cbResponse = 'abc';

    mockTintData.mockReturnValue({ then: jest.fn().mockImplementation((cb) => cb(cbResponse)) });
    mockUseRef.mockReturnValue({ current: 'img-ref' });
    mockUseEffect.mockImplementation((cb, args) => {
      if (args[0] !== prevColor) {
        cb();
      }
      prevColor = args[0];
    });
  });

  it('should render correctly', () => {
    const container = renderer.create(<PreviewArrow {...baseProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should update correctly', () => {
    const container = renderer.create(<PreviewArrow {...baseProps} />);
    expect(mockUseEffect).toBeCalledTimes(2);

    container.update(<PreviewArrow {...baseProps} foregroundColor={'yellow'} />);

    expect(container).toMatchSnapshot();
    expect(mockUseEffect).toBeCalledTimes(3);
  });
});
