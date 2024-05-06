import React from 'react';
import { render } from '@testing-library/react';

import { IAnimationComponentInternal, accessStore } from '../../../store';
import { mockNode, mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { generateUUID } from '../../../utils/mathUtils';

import { AnimationComponentEditor } from './AnimationComponentEditor';

const updateComponentInternalFn = jest.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: jest.fn(() => {
    return mockEditorConfig;
  }),
};

jest.mock('../../../../src/store/Store', () => {
  const originalModule = jest.requireActual('../../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: jest.fn(() => ({})),
  };
});

describe('AnimationComponentEditor', () => {
  const mockComponent: IAnimationComponentInternal = {
    ref: generateUUID(),
    currentAnimations: [''],
  } as IAnimationComponentInternal;

  it('should render as expected', () => {
    accessStore('default').setState(baseState);
    const { container } = render(<AnimationComponentEditor node={mockNode} component={mockComponent} />);
    expect(container).toMatchSnapshot();
  });
});
