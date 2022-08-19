import React from 'react';
import { render } from '@testing-library/react';

import { mockComponent } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { IMotionIndicatorComponentInternal } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';

import AppearanceEditor from './AppearanceEditor';
import { updateComponentForColorTypeSelection as mockUpdateComponentForColorTypeSelection } from './helpers';

jest.mock('./ColorEditor', () => (props: any) => <div id='ColorEditor' data-mocked='ColorEditor' {...props} />);

jest.mock('./PreviewArrow', () => (props: any) => (
  <div id='PreviewArrow' data-mocked='PreviewArrow'>
    {JSON.stringify(props)}
  </div>
));

jest.mock('./helpers', () => {
  return {
    ...jest.requireActual('./helpers'),
    updateComponentForColorTypeSelection: jest.fn(),
  };
});

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

  it('should render correctly without data binding', () => {
    const { container } = render(
      <AppearanceEditor component={component} scale={[1, 2, 3]} onUpdateCallback={onUpdateCallback} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with foreground color binding', () => {
    const { container } = render(
      <AppearanceEditor
        component={{
          ...component,
          valueDataBindings: {
            [Component.MotionIndicatorDataBindingName.ForegroundColor]: { ruleBasedMapId: 'rule-1' },
          },
        }}
        scale={[1, 2, 3]}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with background color binding', () => {
    const { container } = render(
      <AppearanceEditor
        component={{
          ...component,
          valueDataBindings: {
            [Component.MotionIndicatorDataBindingName.BackgroundColor]: { ruleBasedMapId: 'rule-1' },
          },
        }}
        scale={[1, 2, 3]}
        onUpdateCallback={onUpdateCallback}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
