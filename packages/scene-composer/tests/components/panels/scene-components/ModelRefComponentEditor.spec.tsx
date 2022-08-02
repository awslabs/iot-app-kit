/* eslint-disable import/first */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { ModelRefComponentEditor } from '../../../../src/components/panels/scene-components/ModelRefComponentEditor';
import { useStore } from '../../../../src/store';

import { mockNode, mockComponent } from './MockComponents';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
};

describe('ModelRefComponentEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle cast shadow check box', () => {
    useStore('default').setState(baseState);

    const { container } = render(<ModelRefComponentEditor node={mockNode} component={mockComponent} />);
    const polarisWrapper = wrapper(container);
    const checkBox = polarisWrapper.findCheckbox('[data-testid="cast-shadow-checkbox"]');
    checkBox?.findNativeInput().click();
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: mockComponent.ref, castShadow: true },
      undefined,
    );
  });

  it('should toggle cast receive check box', () => {
    useStore('default').setState(baseState);
    const { container } = render(<ModelRefComponentEditor node={mockNode} component={mockComponent} />);
    const polarisWrapper = wrapper(container);
    const checkBox = polarisWrapper.findCheckbox('[data-testid="receive-shadow-checkbox"]');
    checkBox?.findNativeInput().click();
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: mockComponent.ref, receiveShadow: true },
      undefined,
    );
  });

  it('should update local scale numeric', () => {
    useStore('default').setState(baseState);
    const scaledComponent = {
      ...mockComponent,
      localScale: [1, 1, 1],
    };
    const { container } = render(<ModelRefComponentEditor node={mockNode} component={scaledComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();
    select!.openDropdown();
    select!.selectOption(2); // select custom unit
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: mockComponent.ref, localScale: [1, 1, 1], unitOfMeasure: undefined },
      undefined,
    );
  });

  it('should update unit measure select', () => {
    useStore('default').setState(baseState);
    const measuredComponent = {
      ...mockComponent,
      unitOfMeasure: 'meters',
    };
    const { container } = render(<ModelRefComponentEditor node={mockNode} component={measuredComponent} />);
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    select!.openDropdown();
    select!.selectOption(1); // select no unit
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: measuredComponent.ref, localScale: undefined, unitOfMeasure: undefined },
      undefined,
    );
    select!.openDropdown();
    select!.selectOption(2); // select custom unit
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: measuredComponent.ref, localScale: [1, 1, 1], unitOfMeasure: undefined },
      undefined,
    );
    select!.openDropdown();
    select!.selectOption(3); // select first normal unit
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ref: measuredComponent.ref, localScale: undefined, unitOfMeasure: 'millimeters' },
      undefined,
    );
  });
});
