import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { mockComponent } from '../MockComponents';
import { AppearanceEditor } from '../../../../../src/components/panels/scene-components/motion-indicator/AppearanceEditor';
import { IMotionIndicatorComponentInternal } from '../../../../../src/store';
import { KnownComponentType } from '../../../../../src/interfaces';
import { Component } from '../../../../../src/SceneModels';
import { updateComponentForColorTypeSelection as mockUpdateComponentForColorTypeSelection } from '../../../../../src/components/panels/scene-components/motion-indicator/helpers';

jest.mock('../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor', () => {
  const originalModule = jest.requireActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/ColorEditor',
  );
  return {
    ...originalModule,
    ColorEditor: (...props: any[]) => <div id='ColorEditor'>{JSON.stringify(props)}</div>,
  };
});

jest.mock('../../../../../src/components/panels/scene-components/motion-indicator/PreviewArrow', () => {
  const originalModule = jest.requireActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/PreviewArrow',
  );
  return {
    ...originalModule,
    PreviewArrow: (...props: any[]) => <div id='PreviewArrow'>{JSON.stringify(props)}</div>,
  };
});

jest.mock('../../../../../src/components/panels/scene-components/motion-indicator/helpers', () => {
  const originalModule = jest.requireActual(
    '../../../../../src/components/panels/scene-components/motion-indicator/helpers',
  );
  return {
    ...originalModule,
    updateComponentForColorTypeSelection: jest.fn(),
  };
});

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('AppearanceEditor', () => {
  const component: IMotionIndicatorComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.MotionIndicator,
    shape: Component.MotionIndicatorShape.LinearCylinder,
    valueDataBindings: {
      [Component.MotionIndicatorDataBindingName.BackgroundColor]: { ruleBasedMapId: 'rule-1' },
    },
    config: {
      numOfRepeatInY: 4,
      backgroundColorOpacity: 0.5,
    },
  };
  const onUpdateCallback = jest.fn();
  const mockUpdatedComponent = { ref: 'mock-1' };

  beforeEach(() => {
    jest.clearAllMocks();

    (mockUpdateComponentForColorTypeSelection as any).mockReturnValue(mockUpdatedComponent);
  });

  it('should change color type selection and trigger update component call correctly', () => {
    const mockUpdatedComponent = { ref: 'mock-1' };
    (mockUpdateComponentForColorTypeSelection as any).mockReturnValue(mockUpdatedComponent);

    const { container } = render(
      <AppearanceEditor component={component} scale={[1, 2, 3]} onUpdateCallback={onUpdateCallback} />,
    );
    const polarisWrapper = wrapper(container);

    jest.clearAllMocks();

    const select = polarisWrapper.findSelect('[data-testid="motion-indicator-color-type-select"]');

    // not update when color type unchanged
    select!.openDropdown();
    select!.selectOption(1);

    expect(onUpdateCallback).toBeCalledTimes(0);

    // trigger update when color type changed
    select!.openDropdown();
    select!.selectOption(2);

    expect(onUpdateCallback).toBeCalledWith(mockUpdatedComponent, true);
    expect(onUpdateCallback).toBeCalledTimes(1);
  });

  it('should change arrow number and trigger update component call correctly', () => {
    const mockUpdatedComponent = { ref: 'mock-1' };
    (mockUpdateComponentForColorTypeSelection as any).mockReturnValue(mockUpdatedComponent);

    const { container } = render(
      <AppearanceEditor component={component} scale={[1, 2, 3]} onUpdateCallback={onUpdateCallback} />,
    );
    const polarisWrapper = wrapper(container);

    jest.clearAllMocks();

    const input = polarisWrapper.findInput('[data-testid="motion-indicator-arrow-number-input"]');

    input?.setInputValue('5');

    expect(onUpdateCallback).toBeCalledWith(
      {
        ...component,
        config: {
          ...component.config,
          numOfRepeatInY: 5,
        },
      },
      true,
    );
    expect(onUpdateCallback).toBeCalledTimes(1);
  });
});
